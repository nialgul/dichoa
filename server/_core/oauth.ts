import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";
import axios from "axios";

const OAUTH_STATE_COOKIE = "__Host-oauth-state";

function generateRandomString(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Discord OAuth callback
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    // CSRF guard: verify state
    const expectedState = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!state || state !== expectedState) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      // Exchange Discord code for access token
      const tokenResponse = await axios.post(
        "https://discord.com/api/v10/oauth2/token",
        new URLSearchParams({
          client_id: ENV.discordClientId,
          client_secret: ENV.discordClientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: `${req.protocol}://${req.get("host")}/api/oauth/callback`,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Get user info from Discord
      const userResponse = await axios.get("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const discordUser = userResponse.data;
      const discordId = discordUser.id;
      const email = discordUser.email || null;
      const username = discordUser.username || "Discord User";

      // Upsert user (create or update)
      await db.upsertUser({
        openId: `discord-${discordId}`,
        name: username,
        email,
        loginMethod: "discord",
        lastSignedIn: new Date(),
      });

      // Create JWT session token
      const sessionToken = await sdk.createSessionToken(`discord-${discordId}`, {
        name: username,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Discord OAuth login initiator (for reference)
  app.get("/api/oauth/login", (req: Request, res: Response) => {
    const state = generateRandomString(32);
    const redirectUri = `${req.protocol}://${req.get("host")}/api/oauth/callback`;

    res.cookie(OAUTH_STATE_COOKIE, state, {
      path: "/",
      maxAge: 600000, // 10 minutes
      secure: true,
      sameSite: "none",
      httpOnly: true,
    });

    const url = new URL("https://discord.com/api/oauth2/authorize");
    url.searchParams.set("client_id", ENV.discordClientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "identify email guilds");
    url.searchParams.set("state", state);

    res.redirect(url.toString());
  });
}

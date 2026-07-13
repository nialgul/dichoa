import { getDb } from "./db";
import { users, discordUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { ENV } from "./_core/env";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  email: string;
}

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/**
 * Discord OAuth 콜백 처리
 * Authorization code를 access token으로 교환하고 사용자 정보를 저장
 */
export async function handleDiscordOAuthCallback(code: string): Promise<{ user: any; accessToken: string }> {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");

  try {
    // 1. Authorization code를 access token으로 교환
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: ENV.discordClientId,
        client_secret: ENV.discordClientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: ENV.discordRedirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to exchange code for token: ${tokenResponse.statusText}`);
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json();

    // 2. Access token으로 사용자 정보 조회
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user info: ${userResponse.statusText}`);
    }

    const discordUserData: DiscordUser = await userResponse.json();

    // 3. 기존 Discord 사용자 확인
    let existingDiscordUser = await db
      .select()
      .from(discordUsers)
      .where(eq(discordUsers.discordId, discordUserData.id))
      .limit(1);

    let manusUser: any;

    if (existingDiscordUser.length) {
      // 기존 사용자: 토큰 업데이트
      const discordUser = existingDiscordUser[0];
      await db
        .update(discordUsers)
        .set({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          updatedAt: new Date(),
        })
        .where(eq(discordUsers.discordId, discordUserData.id));

      // Manus 사용자 정보 조회
      const manusUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, discordUser.userId))
        .limit(1);

      manusUser = manusUsers[0];
    } else {
      // 새로운 Discord 사용자: Manus 사용자 생성 또는 연결
      // 이 경우 Manus OAuth 사용자가 이미 존재한다고 가정
      // 실제 구현에서는 Manus 사용자 ID를 세션에서 가져와야 함
      throw new Error("Discord account must be linked to existing Manus account");
    }

    return {
      user: manusUser,
      accessToken: tokenData.access_token,
    };
  } catch (error) {
    console.error("Discord OAuth error:", error);
    throw error;
  }
}

/**
 * Discord 서버 목록 조회
 */
export async function getDiscordServers(accessToken: string): Promise<any[]> {
  try {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch guilds: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Discord servers:", error);
    return [];
  }
}

/**
 * Discord 사용자 정보 조회
 */
export async function getDiscordUserInfo(accessToken: string): Promise<DiscordUser | null> {
  try {
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Discord user info:", error);
    return null;
  }
}

/**
 * 토큰 갱신
 */
export async function refreshDiscordToken(refreshToken: string): Promise<DiscordTokenResponse | null> {
  try {
    const response = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: ENV.discordClientId,
        client_secret: ENV.discordClientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to refresh Discord token:", error);
    return null;
  }
}

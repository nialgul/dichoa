export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Start the Discord OAuth login. Call this from an event handler or effect at the
// moment you want to navigate, e.g. `onClick={() => startLogin()}`.
//
// It has SIDE EFFECTS — it navigates immediately to Discord OAuth.
// Do NOT call it during render (no `href={startLogin()}` / `loginUrl={...}`).
export const startLogin = () => {
  const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const scope = "identify email guilds";
  const responseType = "code";

  const url = new URL("https://discord.com/api/oauth2/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", responseType);
  url.searchParams.set("scope", scope);

  window.location.href = url.toString();
;}

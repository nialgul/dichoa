export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Start the Discord OAuth login. Call this from an event handler or effect at the
// moment you want to navigate, e.g. `onClick={() => startLogin()}`.
//
// It has SIDE EFFECTS — it navigates immediately to Discord OAuth.
// Do NOT call it during render (no `href={startLogin()}` / `loginUrl={...}`).
export const startLogin = () => {
  // Redirect to the server-side OAuth initiator which handles state cookie generation
  window.location.href = "/api/oauth/login";
};

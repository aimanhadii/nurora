// Server-safe auth constants (no React), so the root layout can inline the
// redirect script below. Used by lib/auth.ts and lib/profile.ts too.

export const SESSION_KEY = "nurora:session";
export const ACCOUNTS_KEY = "nurora:accounts";
export const PROFILES_KEY = "nurora:profiles:v1";

/**
 * FAKE-AUTH ONLY. Runs in <head> before the first paint so a full page load
 * never flashes the wrong screen:
 *  - logged out on /home, /chat, /tasks or /onboarding  →  /
 *  - logged in on /                                     →  /home (or /onboarding)
 *  - logged in but not onboarded on an app page         →  /onboarding
 *  - onboarded on /onboarding                           →  /home
 * In-app navigation is guarded by components/auth/AuthGate.tsx.
 * With Supabase this moves to the server (proxy.ts reading the session cookie).
 */
export const authRedirectScript = `(function(){try{var p=location.pathname;var s=JSON.parse(localStorage.getItem("${SESSION_KEY}")||"null");var pr=s?JSON.parse(localStorage.getItem("${PROFILES_KEY}")||"{}")[s.userId]:null;var o=!!(pr&&pr.onboardedAt);var app=/^\\/(home|chat|tasks)(\\/|$)/.test(p);var t=null;if(!s&&(app||p==="/onboarding"))t="/";else if(s&&p==="/")t=o?"/home":"/onboarding";else if(s&&!o&&app)t="/onboarding";else if(s&&o&&p==="/onboarding")t="/home";if(t&&t!==p)location.replace(t)}catch(e){}})()`;

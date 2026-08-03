export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

export const isGoogleAuthConfigured = Boolean(GOOGLE_CLIENT_ID);

/** GIS script URL for Google Identity Services (Authorization Code Flow). */
export const GOOGLE_GSI_SCRIPT_URL = "https://accounts.google.com/gsi/client";

export const GOOGLE_OAUTH_SCOPES = "openid email profile";

import {
  GOOGLE_CLIENT_ID,
  GOOGLE_GSI_SCRIPT_URL,
  GOOGLE_OAUTH_SCOPES,
  isGoogleAuthConfigured,
} from "@/config/googleAuth";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient: (config: GoogleCodeClientConfig) => GoogleCodeClient;
        };
      };
    };
  }
}

interface GoogleCodeClientConfig {
  client_id: string;
  scope: string;
  ux_mode?: "popup" | "redirect";
  callback?: (response: GoogleCodeResponse) => void;
  error_callback?: (error: GoogleCodeError) => void;
}

interface GoogleCodeClient {
  requestCode: () => void;
}

interface GoogleCodeResponse {
  code: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface GoogleCodeError {
  type?: string;
  message?: string;
}

let gsiScriptPromise: Promise<void> | null = null;

const loadGoogleIdentityServices = (): Promise<void> => {
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (gsiScriptPromise) {
    return gsiScriptPromise;
  }

  gsiScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_GSI_SCRIPT_URL}"]`
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Failed to load Google Identity Services."))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gsiScriptPromise = null;
      reject(new Error("Failed to load Google Identity Services."));
    };
    document.head.appendChild(script);
  });

  return gsiScriptPromise;
};

/**
 * Opens the Google Identity Services authorization code popup and resolves
 * with the authorization code. Does not use the implicit / ID-token flow.
 */
export const requestGoogleAuthorizationCode = async (): Promise<string> => {
  if (!isGoogleAuthConfigured) {
    throw new Error("Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID.");
  }

  await loadGoogleIdentityServices();

  if (!window.google?.accounts?.oauth2) {
    throw new Error("Google Identity Services failed to initialize.");
  }

  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: GOOGLE_OAUTH_SCOPES,
      ux_mode: "popup",
      callback: (response) => {
        if (response.error || !response.code) {
          reject(
            new Error(
              response.error_description ||
                response.error ||
                "Google authorization was cancelled or failed."
            )
          );
          return;
        }
        resolve(response.code);
      },
      error_callback: (error) => {
        reject(new Error(error.message || "Google authorization failed."));
      },
    });

    client.requestCode();
  });
};

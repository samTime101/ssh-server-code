import type { GoogleNewUserResponse, GoogleSignupPending } from "@/types/auth";

/**
 * Normalize Google new-user responses into a stable Complete Profile state.
 * Prefers signup_token + profile; falls back to Phase 1 flat fields if present.
 */
export const normalizeGoogleSignupPending = (
  data: GoogleNewUserResponse
): GoogleSignupPending | null => {
  const signupToken = data.signup_token;
  const profile = data.profile ?? {
    email: data.email ?? "",
    first_name: data.first_name ?? "",
    last_name: data.last_name ?? "",
  };

  if (!signupToken || !profile.email) {
    return null;
  }

  return { signupToken, profile };
};

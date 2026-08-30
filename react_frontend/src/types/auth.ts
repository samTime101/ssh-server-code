export interface User {
  id: string;
  userId: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  is_active: boolean;
  roles: string[];
  college: string;
  total_right_attempts: string;
  total_attempts: string;
  accuracy_percent: string;
  completion_percent: string;
  is_email_verified: boolean;
}

export interface AuthToken {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  recaptcha?: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  phonenumber: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  college: string;
  recaptcha?: string;
}

export interface ResetPhoneNumberForm {
  new_phonenumber: string;
}

export interface ResetPasswordForm {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
  recaptcha?: string;
}

export interface ResetPasswordVerifyRequest {
  new_password: string;
  confirm_new_password: string;
}

export interface GoogleLoginRequest {
  code: string;
}

export interface GoogleProfile {
  email: string;
  first_name: string;
  last_name: string;
}

export interface GoogleNewUserResponse {
  is_new_user: true;
  signup_token: string;
  profile: GoogleProfile;
  /** @deprecated Temporary flat fields from Phase 1; prefer profile. */
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface GoogleExistingUserResponse {
  is_new_user: false;
  access: string;
  refresh: string;
  user: {
    user_guid: string;
    email: string;
    username: string;
    phonenumber: string;
    first_name: string;
    last_name: string;
    college: string;
  };
}

export type GoogleLoginResponse = GoogleNewUserResponse | GoogleExistingUserResponse;

export type GoogleSignupResponse = GoogleExistingUserResponse;

/**
 * Normalized pending Google signup state passed to Complete Profile.
 */
export interface GoogleSignupPending {
  signupToken: string;
  profile: GoogleProfile;
}

export interface GoogleSignupRequest {
  signup_token: string;
  username: string;
  phonenumber: string;
  college: string;
}

export interface CompleteProfileFormValues {
  username: string;
  phonenumber: string;
  college: string;
}

export interface CompleteProfileLocationState {
  googleSignup: GoogleSignupPending;
}

export interface SetupAdminRequest {
  first_name: string;
  last_name: string;
  phonenumber: string;
  password: string;
  confirm_password: string;
}

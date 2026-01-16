export interface User {
  userId: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phonenumber: string;
  is_active: boolean;
  roles: string[];
  total_right_attempts: string,
  total_attempts: string,
  accuracy_percent: string,
  completion_percent: string,
  is_email_verified: boolean,
}

export interface AuthToken {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  username: string;
  phonenumber: string;
  first_name: string;
  last_name: string;
  password: string;
  college: string;
}

export interface User {
  userId: string;
  email: string;
  username: string;
  phonenumber: string;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
}

export interface AuthToken {
  access: string;
  refresh: string;
}

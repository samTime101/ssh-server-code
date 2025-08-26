export interface User {
  userId: string; // Or number, depending on your model's primary key
  email: string;
  username: string;
  phonenumber: string;
}

export interface AuthToken {
  access: string;
  refresh: string;
}

export type UserRole = "citizen" | "operator" | "admin";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  phone?: string;
  avatar?: string | null;
  date_joined?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterPayload {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  password: string;
  password2: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

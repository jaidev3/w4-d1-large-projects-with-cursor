export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
} 
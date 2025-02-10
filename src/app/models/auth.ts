export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  role: string;
  shop_url: string;
  insales_id: number;
  is_synchronous: boolean;
  is_custom_field_added: boolean;
  export_type: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

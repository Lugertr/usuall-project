export interface AuthState {
  shopToken: string | null;
  shop: Shop | null;
  loading: boolean;
  error: string | null;
  authorizedUsers: User[];
  currentUser: User;
}

export interface User {
  userId: string;
  usersecret: string;
  accessToken: string;
}

export const enum ExportType {
  Delivery = 1,
  WSA
}

export interface Shop {
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
  export_type: ExportType;
  clientID?: string;
  clientSecret?: string;
  object_id?: string;
  wsa_token?: string;
}

export interface LoginDeliveryReq {
  clientID: string;
  clientSecret: string;
}

export interface LoginWSAReq {
  object_id: string;
  wsa_token: string;
}

export interface ClientToken {
  access_token: string;
}

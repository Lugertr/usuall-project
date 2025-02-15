export enum ExportType {
  Delivery = 1,
  WSA,
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
  params: LoginDelivery | LoginWSA | null;
}

export interface LoginDelivery {
  client_id: string;
  client_secret: string;
}

export interface LoginWSA {
  object_id: string;
  wsa_token: string;
}

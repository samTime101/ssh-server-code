export type ClientStatus = "PENDING" | "PROVISIONING" | "ACTIVE" | "SUSPENDED" | "DELETED";

export interface Client {
  id: string;
  organization_name: string;
  address: string;
  pan: string;
  registration_number: string;
  phonenumber: string;
  email: string;
  subdomain: string;
  database_name?: string | null;
  mongo_database_name?: string | null;
  status: ClientStatus;
  pan_photo_url?: string | null;
  registration_photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ClientFormState {
  organization_name: string;
  address: string;
  pan: string;
  registration_number: string;
  phonenumber: string;
  email: string;
  subdomain: string;
  pan_photo: File | null;
  registration_photo: File | null;
}

export interface PaginatedClientsResponse {
  count: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
  results: Client[];
}

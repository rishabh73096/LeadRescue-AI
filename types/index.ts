export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
  businessName?: string;
  website?: string;
  address?: Address;
  timezone?: string;
  bio?: string;
  location?: Pick<Address, "country" | "state" | "city">;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

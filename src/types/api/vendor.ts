export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  category: string;
  description?: string;
  website?: string;
  contactPerson: string;
  taxId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorData {
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  description?: string;
  website?: string;
  contactPerson: string;
  taxId?: string;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  status?: 'active' | 'inactive' | 'pending';
}

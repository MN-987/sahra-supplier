export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: 'Active Host' | 'Pending Host' | 'Active Guest' | 'Anonymous Guest';
  avatar: string;
  createdAt: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  zipCode?: string;
}

export type UserStatus = User['status']; 
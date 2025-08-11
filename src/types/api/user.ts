export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'pending';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  status?: 'active' | 'inactive' | 'pending';
}

import { User } from './user';

export interface UserProfile extends User {
  country: string;
  state: string;
  city: string;
  address: string;
  zipCode: string;
}

export interface Settings {
  banned: boolean;
  emailVerified: boolean;
}

export interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export interface UserProfileFormProps {
  user?: User;
} 
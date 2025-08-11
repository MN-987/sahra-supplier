export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  maxAttendees?: number;
  currentAttendees: number;
  price?: number;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  maxAttendees?: number;
  price?: number;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

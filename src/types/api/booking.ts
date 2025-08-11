export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  attendees: number;
  totalAmount: number;
  notes?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  eventId: string;
  attendees: number;
  notes?: string;
}

export interface UpdateBookingData {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  attendees?: number;
  notes?: string;
}

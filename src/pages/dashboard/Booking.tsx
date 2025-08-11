import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// routes
import { paths } from 'src/routes/paths';
import BookingsView from 'src/sections/bookings/view';

// ----------------------------------------------------------------------

export default function BookingPage() {
  return (
  <>
  <Helmet>
    <title> Booking Page  </title>
  </Helmet>

  <BookingsView />
</> 
) ;
}

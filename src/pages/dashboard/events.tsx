import { Helmet } from 'react-helmet-async';
// sections
import EventsView from 'src/sections/events/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Event</title>
      </Helmet>

      <EventsView />
    </>
  );
}

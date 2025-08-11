import { Helmet } from 'react-helmet-async';
// sections
import CalenderView from 'src/sections/calender/view';

// ----------------------------------------------------------------------

export default function CalenderPage() {
  return (
    <>
      <Helmet>
        <title> Calendar</title>
      </Helmet>

      <CalenderView />
    </>
  );
}

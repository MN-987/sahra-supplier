import { Helmet } from 'react-helmet-async';
// sections
import AnalyticsView from 'src/sections/analytics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> AnalyticsView </title>
      </Helmet>

      <AnalyticsView />
    </>
  );
}

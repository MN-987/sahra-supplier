import { Helmet } from 'react-helmet-async';
// sections
import VendorsView from 'src/sections/vendors/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Vendor</title>
      </Helmet>

      <VendorsView />
    </>
  );
}

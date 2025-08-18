import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
// sections
import UsersView from 'src/sections/users/view';

// ----------------------------------------------------------------------

export default function Page() {
  const location = useLocation();
  const isProfileRoute = location.pathname.includes('/profile');

  return (
    <>
      <Helmet>
        <title> Users </title>
      </Helmet>

      {isProfileRoute ? <Outlet /> : <UsersView />}
    </>
  );
}

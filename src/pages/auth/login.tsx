import { Helmet } from 'react-helmet-async';
// sections
import LoginView from 'src/sections/auth/auth-view';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Login</title>
      </Helmet>

      <LoginView />
    </>
  );
}

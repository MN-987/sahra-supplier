import { Helmet } from 'react-helmet-async';
// sections
import ResetPasswordView from 'src/sections/auth/reset-password-view';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Reset Password - Sahra Dashboard</title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}

// ----------------------------------------------------------------------

const ROOTS = {
  DASHBOARD: '/dashboard',
  AUTH: '/auth',
};

// ----------------------------------------------------------------------

export const paths = {
  // AUTH
  auth: { 
    root: ROOTS.AUTH,
    login: `${ROOTS.AUTH}/login`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    home: `${ROOTS.DASHBOARD}/home`,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    booking: `${ROOTS.DASHBOARD}/booking`,
    management: {
      root: `${ROOTS.DASHBOARD}/management`,
      user: `${ROOTS.DASHBOARD}/management/user`,
      profile: `${ROOTS.DASHBOARD}/management/user/profile`,
      vendor: `${ROOTS.DASHBOARD}/management/vendor`,
      events: `${ROOTS.DASHBOARD}/management/events`,
      calender: `${ROOTS.DASHBOARD}/management/calender`,
      services: `${ROOTS.DASHBOARD}/management/services`,
      create: `${ROOTS.DASHBOARD}/management/services/create`,
    },
  },
};

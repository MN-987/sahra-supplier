import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const icon = (name: string) => <Iconify icon={name} />;

const ICONS = {
  job: icon('solar:case-minimalistic-bold'),
  blog: icon('solar:document-bold'),
  chat: icon('solar:chat-round-dots-bold'),
  mail: icon('solar:letter-bold'),
  user: icon('solar:user-rounded-bold'),
  file: icon('solar:file-bold'),
  lock: icon('solar:lock-bold'),
  tour: icon('solar:map-point-bold'),
  order: icon('solar:cart-bold'),
  label: icon('solar:tag-horizontal-bold'),
  blank: icon('solar:document-bold'),
  kanban: icon('solar:widget-bold'),
  folder: icon('solar:folder-bold'),
  banking: icon('solar:card-bold'),
  booking: icon('solar:calendar-bold'),
  invoice: icon('solar:file-text-bold'),
  product: icon('solar:box-bold'),
  calendar: icon('solar:calendar-bold'),
  disabled: icon('solar:close-circle-bold'),
  external: icon('solar:arrow-up-right-bold'),
  menuItem: icon('solar:menu-dots-bold'),
  ecommerce: icon('solar:cart-bold'),
  analytics: icon('solar:chart-bold'),
  dashboard: icon('solar:home-bold'),
  vendor: icon('solar:users-group-rounded-bold'),
  event: icon('solar:calendar-mark-bold'),
  services: icon('solar:settings-bold'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview ',
        items: [
          { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Analytics', path: paths.dashboard.analytics, icon: ICONS.analytics },
          {
            title: 'Booking',
            path: paths.dashboard.booking,
            icon: ICONS.booking,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          {
            title: 'User',
            path: paths.dashboard.management.user,
            icon: ICONS.user,
            children: [
              { title: 'List', path: paths.dashboard.management.user },
              { title: 'Profile', path: paths.dashboard.management.profile },
            ],
          },
           {
            title: 'Services',
            path: paths.dashboard.management.services,
            icon: ICONS.services,
            children: [
              { title: 'List', path: paths.dashboard.management.services },
              { title: 'Create', path: paths.dashboard.management.create },
            ],
          },
          {
            title: 'Vendor',
            path: paths.dashboard.management.vendor,
            icon: ICONS.vendor,
            children: [
              { title: 'List', path: paths.dashboard.management.vendor },

            ],
          },
          {
            title: 'Events',
            path: paths.dashboard.management.events,
            icon: ICONS.event,
            children: [
              { title: 'List', path: paths.dashboard.management.events },
              { title: 'Create', path: paths.dashboard.management.createEvent },
            ],
          },
          {
            title: 'Calendar',
            path: paths.dashboard.management.calender,
            icon: ICONS.calendar,
          },
       
        ],
      },
    ],
    []
  );

  return data;
}

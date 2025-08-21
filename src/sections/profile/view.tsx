import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Stack, Tabs, Tab, Box } from '@mui/material';


// ----------------------------------------------------------------------

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

export default function ProfileView() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Profile | Sahra Supplier</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 5 }}>
          <Typography variant="h4">Profile Management</Typography>
        </Stack>

        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="profile tabs">
              <Tab label="Business Profile" {...a11yProps(0)} />
              <Tab label="Company Information" {...a11yProps(1)} />
              <Tab label="Account Settings" {...a11yProps(2)} />
            </Tabs>
          </Box>

          {/* <TabPanel value={currentTab} index={0}>
            <BusinessProfileForm />
          </TabPanel> */}

          <TabPanel value={currentTab} index={1}>
            <Typography variant="h6">Company Information</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Company information form will be implemented here.
            </Typography>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Typography variant="h6">Account Settings</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Account settings form will be implemented here.
            </Typography>
          </TabPanel>
        </Box>
      </Container>
    </>
  );
}

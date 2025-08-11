import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from 'src/types/user';
import { Settings, ToggleProps, UserProfileFormProps } from 'src/types/user-profile';
import { Toggle } from 'src/utils/toggle';
import { _userList } from 'src/_mock/_user';
import {
  Box,
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const UserProfileForm: React.FC<UserProfileFormProps> = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData || user;
  const [isHovered, setIsHovered] = useState(false);
  const [isSaveHovered, setIsSaveHovered] = useState(false);

  console.log('User prop:', user);
  console.log('Location state:', location.state);
  console.log('UserData being used:', userData);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active host':
        return 'success.main';
      case 'pending':
        return 'warning.main';
      case 'inactive':
        return 'error.main';
      case 'suspended':
        return 'error.main';
      default:
        return 'info.main';
    }
  };

  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    status: 'Active Host',
    avatar: '',
    createdAt: new Date().toISOString(),
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: ''
  });

  const [settings, setSettings] = useState<Settings>({
    banned: true,
    emailVerified: true
  });

  // Update form data when userData is received
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        ...userData,
        // Keep the additional fields if they exist in userData, otherwise keep the defaults
        country: userData.country || prev.country,
        state: userData.state || prev.state,
        city: userData.city || prev.city,
        address: userData.address || prev.address,
        zipCode: userData.zipCode || prev.zipCode
      }));
    }
  }, [userData]);

  const handleInputChange = (field: keyof User, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggle = (field: keyof Settings): void => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = () => {
    const userIndex = _userList.findIndex(u => u.id === formData.id);
    if (userIndex !== -1) {
      _userList[userIndex] = {
        ..._userList[userIndex],
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        company: formData.company,
        role: formData.role,
        status: formData.status,
        avatarUrl: formData.avatar,
        country: formData.country || '',
        state: formData.state || '',
        city: formData.city || '',
        address: formData.address || '',
        zipCode: formData.zipCode || ''
      };
      navigate('/dashboard/management/user');
    }
  };

  const handleDelete = () => {
    const userIndex = _userList.findIndex(u => u.id === formData.id);
    if (userIndex !== -1) {
      _userList.splice(userIndex, 1);
      navigate('/dashboard/management/user');
    }
  };

  console.log('formData============',formData);
  console.log('_userList============',_userList);

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={3}>
          {/* Left Column - Profile Image and Settings */}
          <Grid item xs={12} md={4}>
          <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                height: '100%'
              }}
            >
            <Stack spacing={3}>
              {/* Profile Image Section */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar
                    src={formData.avatar}
                    alt={formData.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      border: '4px solid', 
                      borderColor: 'grey.200',
                      bgcolor: 'grey.200',
                      fontSize: '2.5rem'
                    }}
                  >
                    {formData.name?.charAt(0)}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: getStatusColor(formData.status),
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: '0 12px 0 12px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {formData.status}
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  Allowed *.jpeg, *.jpg, *.png, *.gif<br />
                  max size of 3 Mb
                </Typography>
              </Box>

              {/* Settings Section */}
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" gutterBottom>Banned</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ maxWidth: '70%' }}>Apply disable account</Typography>
                    <Toggle 
                      checked={settings.banned} 
                      onChange={() => handleToggle('banned')} 
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom>Email verified</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color="text.secondary" sx={{ maxWidth: '90%' }}>
                      Disabling this will automatically send the user a verification email
                    </Typography>
                    <Toggle sx={{fontSize:'0.3rem'}}
                      checked={settings.emailVerified} 
                      onChange={() => handleToggle('emailVerified')} 
                    />
                  </Box>
                </Box>

                <Button
                  variant={isHovered ? "contained" : "outlined"}
                  color="primary"
                  fullWidth
                  sx={{ 
                    mt: 2,
                    color: '#EF4523',
                    borderColor: '#EF4523',
                    '&:hover': {
                      borderColor: '#EF4523',
                      backgroundColor: '#EF4523',
                      color: '#fff'
                    }
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleDelete}
                >
                  Delete user
                </Button>
              </Stack>
            </Stack>
            </Paper>
          </Grid>

          {/* Right Column - Form Fields */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: '0px 0px 2px 0px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
                height: '100%'
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <Box sx={{ display: 'flex', alignItems: 'center', px: 1, bgcolor: 'grey.100' }}>
                          <Typography sx={{ mr: 1 }}>🇨🇦</Typography>
                        </Box>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={formData.country}
                      label="Country"
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    >
                      <MenuItem value="Canada">🇨🇦 Canada</MenuItem>
                      <MenuItem value="USA">🇺🇸 USA</MenuItem>
                      <MenuItem value="UK">🇬🇧 UK</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/region"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip/code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Save Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant={isSaveHovered ? "outlined" : "contained"}
                  color="primary"
                  size="large"
                  onMouseEnter={() => setIsSaveHovered(true)}
                  onMouseLeave={() => setIsSaveHovered(false)}
                  onClick={handleSave}
                >
                  Save changes
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfileForm;
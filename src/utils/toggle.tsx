import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Toggle = styled(Switch)(({ theme }) => ({
  width: 53,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(4px) translateY(7px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(23px) translateY(7px)',
      '& .MuiSwitch-thumb:before': {
        backgroundColor: '#fff',
        borderRadius: '50%',
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#2e7d32' : '#4caf50',
        
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 18,
    height: 18,

    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundColor: '#fff',
      borderRadius: '50%',

    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
})); 
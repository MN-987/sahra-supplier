import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';

interface NameAvatarProps extends Omit<AvatarProps, 'children'> {
  name: string;
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRandomColor = (name: string): string => {
  const colors = [
    '#FF6B6B', // red
    '#4ECDC4', // teal
    '#45B7D1', // blue
    '#96CEB4', // green
    '#FFEEAD', // yellow
    '#D4A5A5', // pink
    '#9B59B6', // purple
    '#3498DB', // light blue
    '#E67E22', // orange
    '#1ABC9C', // turquoise
  ];

  // Use the name to generate a consistent color for the same name
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export const NameAvatar: React.FC<NameAvatarProps> = ({ name, ...props }) => {
  const initials = getInitials(name);
  const backgroundColor = getRandomColor(name);

  return (
    <Avatar
      {...props}
      sx={{
        ...props.sx,
        bgcolor: backgroundColor,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
      }}
    >
      {initials}
    </Avatar>
  );
};

export default NameAvatar; 
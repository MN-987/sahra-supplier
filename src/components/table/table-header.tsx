import React from 'react';
import { Box, Typography, Tabs, Tab, Chip } from '@mui/material';
import { StatusTab } from '../../types/status-tab';
import { TableHeaderProps } from '../../types/table-header-props';

export const TableHeader = ({
  title,
  statusTabs,
  currentTab,
  onTabChange,
}: TableHeaderProps) => {
  const getTabChipColor = (tab: StatusTab, index: number) => {
    if (tab.color) {
      return { bgcolor: `${tab.color}.main`, color: 'white' };
    }
    
    const colors = [
      { bgcolor: 'grey.900', color: 'white' },
      { bgcolor: 'success.main', color: 'white' },
      { bgcolor: 'warning.main', color: 'white' },
      { bgcolor: 'error.main', color: 'white' },
      { bgcolor: 'grey.500', color: 'white' }
    ];
    
    return colors[index] || colors[colors.length - 1];
  };

  return (
    <>
      {/* {title && (
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'grey.600' }}>
          {title}
        </Typography>
      )} */}

      {statusTabs && statusTabs.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue) => onTabChange(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 'auto',
                mr: 2
              }
            }}
          >
            {statusTabs.map((tab, index) => (
              <Tab
                key={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    <Chip
                      label={tab.count}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        ...getTabChipColor(tab, index)
                      }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>
      )}
    </>
  );
}; 
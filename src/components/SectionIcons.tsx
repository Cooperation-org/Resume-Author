import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';

interface Action {
  icon: React.ReactNode; // The icon to render (e.g., <Edit />)
  handler: () => void; // The function to call on click
  label?: string; // Optional tooltip label
}

interface SectionIconsProps {
  actions: Action[]; // List of actions
}

const SectionIcons = ({ actions }: SectionIconsProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {actions.map((action, index) => (
        <Tooltip
          key={index}
          title={action.label || ''}
        >
          <IconButton onClick={action.handler}>{action.icon}</IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

export default SectionIcons;

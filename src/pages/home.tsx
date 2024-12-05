import React from 'react';
import { Box } from '@mui/material';
import Nav from '../components/Nav';
import Hero from '../components/Hero';

const ResumeAuthorLanding: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#4527A0' }}>
      <Nav />
      <Hero />
    </Box>
  );
};

export default ResumeAuthorLanding;

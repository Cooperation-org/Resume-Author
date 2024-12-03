import React from 'react';
import { Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        Welcome to the Home Page
      </Typography>
      <Link to="/login">
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
        >
          Go to the Login Page
        </Typography>
      </Link>
    </Box>
  );
};

export default Home;

import { useState } from 'react';
import { Box, Button, Typography, Tooltip } from '@mui/material';
import { SVGFolder, SVGSinfo } from '../assets/svgs';
import LoadingOverlay from './Loading';

export function Login() {
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = 'http://localhost:3000'; // Update for production
    const scope = 'https://www.googleapis.com/auth/drive.file';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}&prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        textAlign: 'center',
        height: '60vh',
        mt: 4,
      }}
    >
      {/* Google Drive Icon */}
      <Box
        sx={{
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SVGFolder />
      </Box>

      {/* Main text */}
      <Typography
        sx={{
          fontSize: 24,
        }}
      >
        First, connect to Google Drive so you can save your data.
      </Typography>

      {/* Google Login Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleLogin}
        sx={{
          mt: 2,
          px: 4,
          py: 0.5,
          fontSize: '16px',
          borderRadius: 5,
          textTransform: 'none',
          backgroundColor: '#003FE0',
        }}
      >
        Connect to Google Drive{' '}
        <Tooltip title="You must have a Google Drive account and be able to log in. This is where your credentials will be saved.">
          <Box sx={{ ml: 2, mt: '2px' }}>
            <SVGSinfo />
          </Box>
        </Tooltip>
      </Button>

      {/* Skip Login Button */}
      <Button
        variant="text"
        color="primary"
        onClick={() => (window.location.hash = '#step1')}
        sx={{
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'underline',
          textTransform: 'none',
        }}
      >
        Continue without Saving
      </Button>

      {/* Loading Overlay */}
      <LoadingOverlay
        text="Connecting..."
        open={loading}
      />
    </Box>
  );
}

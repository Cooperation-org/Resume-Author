import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const SelectionScreen = () => {
  const handleNewResume = () => {
    // TODO: Navigate to new resume creation
    console.log('Creating new resume');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Welcome to Resume Builder
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
        >
          Choose how you would like to proceed
        </Typography>
      </Box>

      <Stack
        spacing={3}
        sx={{ maxWidth: 600, mx: 'auto' }}
      >
        <Card>
          <CardContent
            sx={{
              p: 4,
              cursor: 'pointer',
              '&:hover': { bgcolor: 'action.hover' },
            }}
            onClick={handleNewResume}
          >
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
            >
              <AddIcon
                color="primary"
                sx={{ fontSize: 40 }}
              />
              <Link to="/resume/new">
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                  >
                    Start New Resume
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Create a fresh resume from scratch
                  </Typography>
                </Box>
              </Link>
            </Stack>
          </CardContent>
        </Card>

        <Tooltip title="This feature is not available yet">
          <Card sx={{ opacity: 0.6 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <DescriptionIcon
                  sx={{ fontSize: 40, color: 'text.disabled' }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="text.disabled"
                  >
                    Continue Existing Resume
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                  >
                    Continue working on a previously saved resume
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Tooltip>
      </Stack>
    </Container>
  );
};

export default SelectionScreen;

// import { Resume } from '@cooperation/vc-storage'
// import { Title } from '@mui/icons-material'
import { Box, Typography, Button, Divider } from '@mui/material'
import { FileText, Sparkles } from 'lucide-react'

const RightSidebar = () => {
  return (
    <Box sx={{ width: 280 }}>
      {/* Title */}
      <Typography variant='subtitle1' fontWeight='600'>
        Title of Resume (editable)
      </Typography>
      <Typography variant='caption' color='gray' mb={4}>
        12:53pm Saved
      </Typography>
      <Divider sx={{ mb: 4 }} />

      {/* Add Credentials */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'start',
            mb: 2
          }}
        >
          <Typography variant='subtitle1' fontWeight='600'>
            Add Credentials
          </Typography>
          <Button size='small' sx={{ textTransform: 'none', ml: 1 }}>
            Learn more
          </Button>
        </Box>
        <Button
          variant='outlined'
          fullWidth
          startIcon={<FileText />}
          sx={{
            mb: 2,
            fontSize: '0.8rem',
            display: 'flex',
            justifyContent: 'start'
          }}
        >
          Connect to Google Drive
        </Button>
        <Button
          variant='outlined'
          fullWidth
          startIcon={<FileText />}
          sx={{
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            display: 'flex',
            justifyContent: 'start'
          }}
        >
          Connect Digital Wallet
        </Button>
      </Box>

      {/* Insights */}
      <Box>
        <Typography variant='subtitle1' fontWeight='600' mb={1}>
          Insights
        </Typography>
        <Typography variant='body2' color='gray' mb={2}>
          Get AI insights on your resume, with suggestions on how to improve
        </Typography>
        <Button variant='outlined' fullWidth startIcon={<Sparkles />}>
          Get Insights
        </Button>
      </Box>
    </Box>
  )
}

export default RightSidebar

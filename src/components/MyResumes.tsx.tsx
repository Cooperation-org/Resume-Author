import React from 'react'
import { Box, Typography } from '@mui/material'
import ResumeCard from './ResumeCard'
import { Link } from 'react-router-dom'

const ResumeScreen: React.FC = () => {
  return (
    <Box
      sx={{
        mx: 'auto',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        marginInline: 3,
        gap: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          mt: 2
        }}
      >
        <Typography variant='h4' sx={{ color: '#2E2E48', fontWeight: 700 }}>
          My Resumes
        </Typography>
        <Link
          style={{
            background: '#4F46E5',
            padding: '0.7rem 1rem',
            borderRadius: '40px',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: 500
          }}
          to='/resume/new'
        >
          Create new resume
        </Link>
      </Box>
      <ResumeCard
        id='1'
        title='Alice Parker Resume'
        date='January 1, 2025'
        credentials={3}
      />
      <ResumeCard
        id='2'
        title='Linguist'
        date='September 17, 2024'
        credentials={2}
        isDraft={true}
        lastUpdated='2 months ago'
      />
      <ResumeCard
        id='3'
        title='Product Designer'
        date='August 30, 2024'
        credentials={1}
      />
    </Box>
  )
}

export default ResumeScreen

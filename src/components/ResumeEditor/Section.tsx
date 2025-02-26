import React from 'react'
import { Paper, Box, Typography, Button } from '@mui/material'
import SectionDetails from './SectionDetails'

interface SectionProps {
  sectionId: string
  onDelete?: () => void
  onAddFiles?: () => void
  onAddCredential?: (text: string) => void
  isRemovable?: boolean
}

const Section: React.FC<SectionProps> = ({
  sectionId,
  onDelete,
  onAddFiles,
  onAddCredential,
  isRemovable = false
}) => {
  return (
    <Paper
      sx={{
        bgcolor: '#FFF',
        p: '5px 20px 10px 20px',
        mb: '30px',
        borderRadius: '8px',
        boxShadow: '0px 2px 20px 0px rgba(0, 0, 0, 0.10)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          p: '15px 0 10px 0'
        }}
      >
        <Typography
          variant='h6'
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            color: '#2E2E48'
          }}
        >
          {sectionId}
        </Typography>
        {isRemovable && (
          <Button
            variant='outlined'
            color='error'
            size='small'
            onClick={onDelete}
            sx={{
              textTransform: 'none',
              borderColor: '#F1F1FB',
              color: '#2E2E48'
            }}
          >
            Remove Section
          </Button>
        )}
      </Box>

      <SectionDetails
        sectionId={sectionId}
        onDelete={onDelete}
        onAddFiles={onAddFiles}
        onAddCredential={onAddCredential}
      />
    </Paper>
  )
}

export default Section

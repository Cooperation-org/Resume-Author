import { Box, Typography } from '@mui/material';
import LeftSidebar from './ResumeEditor/LeftSidebar';
import RightSidebar from './ResumeEditor/RightSidebar';
import Section from './ResumeEditor/Section';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ResumeEditor = () => {
  const resume = useSelector((state: RootState) => state.resume.resume);
  console.log('🚀 ~ ResumeEditor ~ resume:', resume);
  // Define the order of sections, add or remove sections as needed
  const sectionOrder: (keyof Resume)[] = ['summary', 'experience', 'education'];

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 4, height: '100vh' }}>
      <LeftSidebar />

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          fontWeight="600"
          mb={2}
        >
          Edit your resume
        </Typography>
        {resume &&
          sectionOrder.map(key => (
            <Section
              key={key}
              sectionId={key}
              sectionData={resume[key]}
            />
          ))}
      </Box>

      <RightSidebar />
    </Box>
  );
};

export default ResumeEditor;

import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import CredentialSidebar from './ResumeEditor/CredentialSidebar';
import Section from './ResumeEditor/Section';

export const ResumeEditor = () => {
  const resume = useSelector((state: RootState) => state.resume.resume);

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 3 }}>
      <CredentialSidebar />
      <Box sx={{ flex: 1 }}>
        <Section
          type="summary"
          title="Summary"
          content={resume?.summary}
        />
      </Box>
    </Box>
  );
};

export default ResumeEditor;

import { Box } from '@mui/material';
import CredentialSidebar from './ResumeEditor/CredentialSidebar';
import Section from './ResumeEditor/Section';

export const ResumeEditor = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, p: 3 }}>
      <CredentialSidebar />
      <Box sx={{ flex: 1 }}>
        <Section
          type="summary"
          title="Summary"
        />
      </Box>
    </Box>
  );
};

export default ResumeEditor;

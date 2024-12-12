import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCookie } from '../tools';
import { GoogleDriveStorage, Resume } from '@cooperation/vc-storage';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { setSelectedResume } from '../redux/slices/resume';

const PrevResumesList = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [userSessions, setSessions] = useState<
    { id: string; name: string; content: any }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch(); // Access the Redux dispatch function

  const getSessions = useCallback(async () => {
    try {
      const accessToken = getCookie('auth_token');
      if (!accessToken) {
        console.error('Access token not found.');
        return;
      }

      setLoading(true);
      const storage = new GoogleDriveStorage(accessToken);
      const resumeManager = new Resume(storage);
      const nonSignedResumes = await resumeManager.getNonSignedResumes();

      console.log('🚀 ~ getSessions ~ nonSignedResumes:', nonSignedResumes);

      // Map resumes to the required format for display
      const sessions = nonSignedResumes.map((resume: any) => ({
        id: resume.id,
        name: resume.name || 'Unnamed Resume',
        content: resume.content, // Include content for dispatching
      }));
      setSessions(sessions);
    } catch (error) {
      console.error('Error fetching non-signed resumes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      getSessions();
    }
  }, [open, getSessions]);

  const handleSelectResume = (resume: {
    id: string;
    name: string;
    content: any;
  }) => {
    console.log('Selected resume:', resume);
    dispatch(setSelectedResume(resume.content)); // Dispatch the selected resume content
    onClose(); // Close the dialog
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Uncompleted Resumes</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : userSessions.length === 0 ? (
          <p>No resumes found.</p>
        ) : (
          <List>
            {userSessions.map(session => (
              <ListItem
                sx={{
                  cursor: 'pointer',
                  boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.1)',
                  borderRadius: '5px',
                  marginBottom: '5px',

                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    transform: '0.3s',
                  },
                }}
                key={session.id}
                onClick={() => handleSelectResume(session)} // Handle resume selection
              >
                <ListItemText primary={session.content.name} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="primary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrevResumesList;

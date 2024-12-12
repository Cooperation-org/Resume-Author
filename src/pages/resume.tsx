import React from 'react';
import ResumeEditor from '../components/Editor';
import PrevResumesList from '../components/ResumeList';

const Resume = () => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <PrevResumesList
        open={open}
        onClose={handleClose}
      />
      <ResumeEditor />
    </div>
  );
};

export default Resume;

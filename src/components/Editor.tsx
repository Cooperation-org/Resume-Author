import {
  Box,
  Button,
  Typography,
  Autocomplete,
  TextField,
} from '@mui/material';
import LeftSidebar, { leftSections } from './ResumeEditor/LeftSidebar';
import RightSidebar from './ResumeEditor/RightSidebar';
import Section from './ResumeEditor/Section';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

const nonVisibleSections = [
  ...leftSections,
  'id',
  'lastUpdated',
  'version',
  'error',
  'status',
  'isDirty',
];

const ResumeEditor = () => {
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [sectionOrder, setSectionOrder] = useState<(keyof Resume)[]>([
    'summary',
    'experience',
    'education',
  ]);

  const resume = useSelector((state: RootState) => state.resume.resume);
  useEffect(() => {
    console.log('🚀 ~ resume', resume);
  }, [resume]);

  const AllSections = Object.keys(resume as Resume).filter(
    sec =>
      !sectionOrder.includes(sec as keyof Resume) &&
      !nonVisibleSections.includes(sec)
  );

  const handleSectionSelect = (event: any, value: string | null) => {
    setSelectedSection(value);
  };

  const handleAddSelectedSection = () => {
    if (selectedSection && AllSections.includes(selectedSection)) {
      setSectionOrder(prev => [...prev, selectedSection as keyof Resume]);
      setSelectedSection(null); // Reset selection
    }
    setAddSectionOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 4, marginBottom: 2 }}>
      <LeftSidebar />

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Box>
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
              />
            ))}
        </Box>

        {/* Add Section Button */}
        {!addSectionOpen && (
          <Button
            variant="outlined"
            startIcon={<Plus />}
            sx={{ mb: 2, fontSize: '1rem', borderRadius: 5 }}
            onClick={() => setAddSectionOpen(true)}
          >
            Add Section
          </Button>
        )}

        {/* Autocomplete for Adding New Sections */}
        {addSectionOpen && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
            }}
          >
            <Autocomplete
              options={AllSections}
              value={selectedSection}
              onChange={handleSectionSelect}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Add Section"
                  placeholder="Type to search..."
                  variant="outlined"
                  fullWidth
                />
              )}
              fullWidth
            />
            <Button
              onClick={handleAddSelectedSection}
              disabled={!selectedSection}
              sx={{ borderRadius: 5 }}
            >
              Add
            </Button>
          </Box>
        )}
      </Box>

      <RightSidebar />
    </Box>
  );
};

export default ResumeEditor;

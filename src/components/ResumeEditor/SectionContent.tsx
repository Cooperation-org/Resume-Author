import { Typography } from '@mui/material';
import Summary from '../Sections/Summary';

const SectionContent = ({
  type,
  content,
  isEditing,
  onContentChange,
}: {
  type: string;
  content: any;
  isEditing: boolean;
  onContentChange: (content: any) => void;
}) => {
  switch (type) {
    case 'summary':
      return (
        <Summary
          content={content}
          isEditing={isEditing}
          onContentChange={onContentChange}
        />
      );

    default:
      return <Typography>{content}</Typography>;
  }
};

export default SectionContent;

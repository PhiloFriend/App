import React from 'react';
import { Box } from '@mui/joy';
import EmotionalQuiz from '../modules/new-quiz/EmotionalQuiz';

export const ReflectPage: React.FC = () => {
  return (
    <Box sx={{ padding: 4 }}>
      <EmotionalQuiz />
    </Box>
  );
};

export default ReflectPage;
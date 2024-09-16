import React from "react";

import { Box, Typography } from "@mui/joy";

interface QuizHeaderProps {
  title: string;
  questionNumber: number;
  quizMaxQuestions: number;
}

export const QuizHeader = ({
  title,
  questionNumber,
  quizMaxQuestions,
}: QuizHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography level="h2" sx={{ fontWeight: 400 }}>
        {title}
      </Typography>
      <Typography level="h3" sx={{ fontWeight: 400 }}>
        {questionNumber}/{quizMaxQuestions}
      </Typography>
    </Box>
  );
};

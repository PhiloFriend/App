import React from "react";
import { Box, Typography } from "@mui/joy";

interface QuestionProps {
  body: string;
}

export const Question = ({ body }: QuestionProps) => {
  return (
    <Box sx={{ mt: "1em" }}>
      <Typography level="body-lg">{body}</Typography>
    </Box>
  );
};

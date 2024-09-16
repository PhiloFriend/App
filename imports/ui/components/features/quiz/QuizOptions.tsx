import React from "react";
import { Box, Typography, Grid } from "@mui/joy";

interface QuizOptionsProps {
  options: Array<string>;
  onSelect: (
    answerIndex: number,
    answerLetter: string,
    answerText: string
  ) => void;
}

export const QuizOptions = ({ options, onSelect }: QuizOptionsProps) => {
  const getLetterForIndex = (index: number) => {
    return String.fromCharCode(65 + index); // 65 is the ASCII code for 'A'
  };

  return (
    <Box sx={{ mt: "1em" }}>
      <Grid container spacing={2}>
        {options.map((option, index) => (
          <Grid sm={6}>
            <Box
              sx={{
                background: "#fcfcfc",
                border: "1px solid ",
                borderColor: (theme) => theme.palette.divider,
                padding: "1em",
                borderRadius: 8,
                cursor: "pointer",
                transition: "200ms",
                minHeight: "5em",
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  borderColor: (theme) => theme.palette.primary[200],
                },
              }}
              key={option}
              onClick={() => onSelect(index, getLetterForIndex(index), option)}
            >
              <Typography level="body-md">
                <Typography sx={{ fontWeight: 700 }} level="body-md">
                  {getLetterForIndex(index)}.{" "}
                </Typography>
                {option}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

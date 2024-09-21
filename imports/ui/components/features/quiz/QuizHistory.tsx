import React from "react";
import { Box, Typography, Card, CardContent, Divider, Grid } from "@mui/joy";

interface HistoryItem {
  question: string;
  answer: string;
}

interface QuizHistoryProps {
  history: HistoryItem[];
}

export const QuizHistory: React.FC<QuizHistoryProps> = ({ history }) => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Box sx={{ margin: "auto", mt: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        Your Answers
      </Typography>
      <Grid container spacing={1}>
        {history.map((item, index) => (
          <Grid xs={6} sm={3} md={2}>
            <Card variant="plain" key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography level="title-md" sx={{ mb: 1 }}>
                  Question {index + 1}
                </Typography>
                <Typography
                  level="body-sm"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  {item.question}
                </Typography>
                <Typography level="body-sm" sx={{ fontStyle: "italic" }}>
                  {item.answer}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

import React from "react";
import { Box, Typography, Grid } from "@mui/joy";

export const Steps: React.FC = () => {
  const steps = [
    {
      title: "Daily Reflection",
      description:
        "Set aside a minute to engage with thoughtful questions drawn from the breadth of human experience.",
      image: "/daily-reflection.png", // Replace with your actual image path
    },
    {
      title: "Personalized Insights",
      description:
        "Receive wisdom tailored to your reflections, inspired by the ages yet relevant to your journey today.",
      image: "/personalized_insight.png", // Replace with your actual image path
    },
    {
      title: "Ongoing Growth",
      description:
        "Observe your evolution over time, discovering patterns and gaining deeper self-understanding.",
      image: "/ongoing-growth.png", // Replace with your actual image path
    },
  ];

  return (
    <Box sx={{ py: 10 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4 }}>
        <Typography level="h2" sx={{ textAlign: "center", mb: 6 }}>
          A Companion on Your Path to Wisdom
        </Typography>
        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid key={index} xs={12} md={4}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <Box component="img" src={step.image} />
                <Box sx={{ p: 2, flexGrow: 1 }}>
                  <Typography level="h4" sx={{ mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography>{step.description}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Steps;

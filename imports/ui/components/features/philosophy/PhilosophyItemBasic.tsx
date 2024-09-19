import React from "react";

import { PhilosophyType } from "/imports/ui/types";
import { AspectRatio, Box, Grid, Typography } from "@mui/joy";

interface PhilosophyItemBasicProps {
  variant: "primary" | "complementary";
  philosophy: PhilosophyType;
}

export const PhilosophyItemBasic = ({
  variant,
  philosophy,
}: PhilosophyItemBasicProps) => {
  return (
    <div>
      <Grid mb="2em" spacing={3} container>
        <Grid md={4}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <img
              src={`/${philosophy.id}.webp`}
              alt="Grow"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />{" "}
          </Box>
        </Grid>
        <Grid md={8}>
          <Typography
            mb="0.5em"
            level={variant === "primary" ? "h3" : "h4"}
            sx={{ fontWeight: 500 }}
          >
            {philosophy.name}
          </Typography>
          <Typography
            mb="1em"
            level={variant === "primary" ? "body-lg" : "body-sm"}
            sx={{ fontWeight: 300 }}
          >
            <Typography sx={{ fontWeight: 500 }}>Description: </Typography>
            {philosophy.explanation}
          </Typography>

          <Typography
            mb="0.5em"
            level={variant === "primary" ? "body-lg" : "body-sm"}
            sx={{ fontWeight: 300 }}
          >
            <Typography sx={{ fontWeight: 500 }}>Relevance: </Typography>{" "}
            {philosophy.relevance}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

import React from "react";
import { Box, Typography, Grid } from "@mui/joy";

interface HeroProps {
  title: string;
  subtitle: string;
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 60px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Grid container sx={{ height: "100%" }}>
        <Grid
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Typography
            level="h2"
            component="h1"
            sx={{
              mb: 2,
              fontWeight: "bold",
              letterSpacing: "tight",
            }}
          >
            {title}
          </Typography>
          <Typography
            level="h3"
            component="h2"
            sx={{
              mb: 4,
              maxWidth: "40rem",
              fontSize: {
                xs: "1rem",
                sm: "1.25rem",
                md: "1.5rem",
              },
              fontWeight: "light",
            }}
          >
            {subtitle}
          </Typography>
        </Grid>
        <Grid xs={12} md={6}>
          <Box sx={{ overflow: "hidden", position: "relative" }}>
            <Box
              component="img"
              src="/about-hero.webp"
              sx={{
                position: "absolute",
                left: "50%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

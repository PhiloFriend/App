import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, Box } from "@mui/joy";

const ImageLayout = () => {
  const [referenceNumber, setReferenceNumber] = useState(45);

  useEffect(() => {
    const updateReferenceNumber = () => {
      const windowWidth = window.innerWidth;
      const isMdUp = windowWidth >= 900; // Joy UI's default md breakpoint
      const percentage = !isMdUp ? 0.066 : 0.033;
      setReferenceNumber(Math.round(windowWidth * percentage));
    };

    updateReferenceNumber();
    window.addEventListener("resize", updateReferenceNumber);

    return () => window.removeEventListener("resize", updateReferenceNumber);
  }, []);

  const containerStyle = {
    display: "flex",
    gap: "2px",
    width: referenceNumber * 11,
    height: referenceNumber * 10, // Adjust as needed
  };

  const leftColumnStyle = {
    marginTop: `${referenceNumber * 3.5}px`,
  };

  const rightColumnStyle = {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  };

  const imageStyle = {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={leftColumnStyle}>
        <Box
          component="img"
          src="/reflect.jpg"
          alt="Image B"
          sx={{
            ...imageStyle,
            width: referenceNumber * 5,
            height: referenceNumber * 5,
          }}
        />
      </Box>
      <Box sx={rightColumnStyle}>
        <Box
          component="img"
          src="/grow.jpg"
          alt="Image A"
          sx={{
            ...imageStyle,
            flex: "2",
            width: referenceNumber * 6,
            height: referenceNumber * 6,
          }}
        />
        <Box
          component="img"
          src="/way.jpg"
          alt="Image C"
          sx={{
            ...imageStyle,
            flex: "1",
            width: referenceNumber * 4,
            height: referenceNumber * 4,
          }}
        />
      </Box>
    </Box>
  );
};

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero = ({ onCtaClick }: HeroProps) => {
  return (
    <Grid container sx={{ marginTop: "4em" }} spacing={2}>
      <Grid xs={10} md={6} sm={10} sx={{ order: { xs: 2, md: 2 } }}>
        <Typography sx={{ fontSize: "3.5em" }} level="h1">
          Bespoke Wisdom
        </Typography>
        <Typography
          sx={{ fontSize: "2.5em", fontWeight: 400, mt: 1 }}
          level="h2"
        >
          Discover Your Path, Reflect, and <br />
          <Typography sx={{ fontSize: "1.5em", lineHeight: 1 }}>
            Grow
          </Typography>
        </Typography>
        <Button
          sx={{ fontSize: "1.3em", mt: 3 }}
          size="lg"
          onClick={onCtaClick}
        >
          Start Your Journey
        </Button>
      </Grid>
      <Grid
        xs={2}
        md={6}
        sm={2}
        sx={{ order: { xs: 1, md: 2 }, mb: { xs: 4, md: 0 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <ImageLayout />
        </Box>
      </Grid>
    </Grid>
  );
};

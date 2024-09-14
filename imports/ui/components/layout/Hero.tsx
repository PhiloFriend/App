import React from "react";
import { Button, Grid, Typography } from "@mui/joy";

export const Hero = () => {
  return (
    <Grid container sx={{ marginTop: "4em" }}>
      <Grid md={6}>
        <Typography sx={{ fontSize: "3.5em" }} level="h1">
          Bespoke Wisdom
        </Typography>
        <Typography sx={{ fontSize: "2.5em", fontWeight: 400, mt: 1 }} level="h2">
          Discover Your Path, Reflect, and <br />
          <Typography sx={{ fontSize: "1.5em", lineHeight: 1 }}>
            Grow
          </Typography>
        </Typography>
        <Button sx={{ fontSize: "1.3em", mt: 3 }} size="lg">Start Your Journey</Button>
      </Grid>
      <Grid md={6}>
        
      </Grid>
    </Grid>
  );
};

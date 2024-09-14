import React from "react";
import { Typography } from "@mui/joy";

export const Logo = () => {
  return (
    <Typography sx={{ fontWeight: 400, letterSpacing: -2 }} level="h2">
      <Typography sx={{ fontWeight: 500 }}>P</Typography>hilo
      <Typography sx={{ fontWeight: 500 }}>F</Typography>riend
    </Typography>
  );
};

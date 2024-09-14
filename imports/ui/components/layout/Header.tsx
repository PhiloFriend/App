import React from "react";
import { Box, Button } from "@mui/joy";
import { Logo } from "../common/Logo";

export const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5em 2em",
        borderBottom: "1px solid",
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Logo />
      <Box>
        <Button variant="solid" >Get Start</Button>
      </Box>
    </Box>
  );
};

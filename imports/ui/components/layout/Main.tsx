import React, { ReactNode } from "react";
import Box from "@mui/joy/Box";
import { SxProps } from "@mui/joy/styles/types";

interface ResponsiveContainerProps {
  children: ReactNode;
  sx?: SxProps;
}

export const Main: React.FC<ResponsiveContainerProps> = ({ children, sx }) => {
  return (
    <Box
      sx={{
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1280px",
        width: "100%",
        marginBottom: '400px',
        ...sx, // Allow overriding or extending styles
      }}
    >
      {children}
    </Box>
  );
};

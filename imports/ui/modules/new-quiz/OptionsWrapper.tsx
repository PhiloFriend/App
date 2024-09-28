import React from "react";
import { Grid, Box } from "@mui/joy";

interface OptionsWrapperProps {
  options: React.ReactNode[];
}

export const OptionsWrapper: React.FC<OptionsWrapperProps> = ({ options }) => {
  const optionsCount = options.length;

  if (optionsCount > 8) {
    console.warn("OptionsWrapper supports a maximum of 8 options");
  }

  const getGridConfig = () => {
    switch (optionsCount) {
      case 1:
        return { xs: 12 };
      case 2:
        return { xs: 6 };
      case 3:
        return { xs: 6, sm: 4 };
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      default:
        return { xs: 6, sm: 3 };
    }
  };

  const gridConfig = getGridConfig();

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {options.slice(0, 8).map((option, index) => (
          <Grid key={index} {...gridConfig}>
            {option}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OptionsWrapper;

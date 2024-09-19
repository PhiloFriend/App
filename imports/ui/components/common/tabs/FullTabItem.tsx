import React from "react";
import { FullTabType } from "./types";
import { AspectRatio, Box, Grid, Typography } from "@mui/joy";

interface FullTabProps {
  tab: FullTabType;
  selected: boolean;
}

export const FullTabItem = ({ tab, selected }: FullTabProps) => {
  return (
    <Box
      sx={
        selected
          ? {
              background: (theme) => ` ${theme.palette.primary[500]}`,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              padding: "1em",
              cursor: "pointer",
              transition: "200ms",
            }
          : {
              border: (theme) => `1px solid ${theme.palette.divider}`,
              padding: "1em",
              cursor: "pointer",
              transition: "200ms",
              "&:hover": {
                background: (theme) => ` ${theme.palette.primary[50]}`,
              },
            }
      }
    >
      <Grid container spacing={2}>
        <Grid md={5} xs={12}>
          <AspectRatio ratio={1}>
            <img src={tab.image} />
          </AspectRatio>
        </Grid>
        <Grid md={7} xs={12}>
          <Box>
            <Typography
              sx={{ mb: "1em", color: selected ? "#f8f8f8" : null }}
              level="h4"
            >
              {tab.title}
            </Typography>
            <Typography
              sx={{ mb: "1em", color: selected ? "#E1DBD0" : null }}
              level="body-md"
            >
              {tab.description}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

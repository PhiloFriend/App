import React from "react";
import { PhilosophyType } from "/imports/api/Philosophies";
import { AspectRatio, Box, Typography } from "@mui/joy";

interface PhilosophySamllItemProps {
  philosophy: PhilosophyType;
}

export const PhilosophySmallItem = ({
  philosophy,
}: PhilosophySamllItemProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        mr: '1em',
        transition: '200ms',
        "&:hover": {
            background: theme => theme.palette.primary[50]
        }
      }}
    >
      <AspectRatio ratio="1">
        <img src={`/${philosophy.id}.webp`} />
      </AspectRatio>
      <Box
        sx={{
          padding: "0.25em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: '5em',
          height: 'calc(100% - 120px)',
          textAlign: 'center'
        }}
      >
        <Typography level="body-md">{philosophy.name}</Typography>
      </Box>
    </Box>
  );
};

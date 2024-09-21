import React from "react";
import { PhilosophyType } from "/imports/api/Philosophies";
import { AspectRatio, Box, Typography } from "@mui/joy";

interface PhilosophySamllItemProps {
  philosophy: PhilosophyType;
  onClick?: React.MouseEventHandler<HTMLDivElement> | (() => void);
  selected?: boolean;
}

export const PhilosophySmallItem = ({
  philosophy,
  onClick,
  selected,
}: PhilosophySamllItemProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        mr: "1em",
        transition: "200ms",
        background: selected
          ? (theme) => theme.palette.primary[500]
          : (theme) => theme.palette.background.surface,
        "&:hover": {
          background: selected
            ? (theme) => theme.palette.primary[400]
            : (theme) => theme.palette.primary[50],
        },
      }}
      onClick={onClick}
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
          minHeight: "5em",
          height: "calc(100% - 120px)",
          textAlign: "center",
        }}
      >
        <Typography
          level="body-md"
          sx={{
            color: selected
              ? (theme) => theme.palette.background.surface
              : (theme) => theme.palette.primary[500],
          }}
        >
          {philosophy.name}
        </Typography>
      </Box>
    </Box>
  );
};

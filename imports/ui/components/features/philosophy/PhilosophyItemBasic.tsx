import React from "react";

import { PhilosophyType } from "/imports/ui/types";
import { AspectRatio, Box, Grid, IconButton, Typography } from "@mui/joy";
import { Close } from "@mui/icons-material";

interface PhilosophyItemBasicProps {
  variant: "primary" | "complementary";
  philosophy: PhilosophyType;
  onRemove?: React.MouseEventHandler<HTMLAnchorElement> | (() => void);
}

export const PhilosophyItemBasic = ({
  variant,
  philosophy,
  onRemove,
}: PhilosophyItemBasicProps) => {
  return (
    <div>
      <Grid mb="2em" spacing={3} container>
        <Grid sm={6} xs={6} md={4}>
          <Box sx={{ position: "relative", height: "100%" }}>
            <img
              src={`/${philosophy.id}.webp`}
              alt="Grow"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />{" "}
          </Box>
        </Grid>
        <Grid md={8} sm={6} xs={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <Typography
              mb="0.5em"
              level={variant === "primary" ? "h3" : "h4"}
              sx={{ fontWeight: 500 }}
            >
              {philosophy.name}
            </Typography>
            {onRemove ? (
              <IconButton onClick={(e) => onRemove(e)}>
                <Close />
              </IconButton>
            ) : null}
          </Box>

          <Typography
            mb="1em"
            level={variant === "primary" ? "body-lg" : "body-sm"}
            sx={{ fontWeight: 300 }}
          >
            <Typography sx={{ fontWeight: 500 }}>Description: </Typography>
            {philosophy.explanation}
          </Typography>
          {philosophy.relevance ? (
            <Typography
              mb="0.5em"
              level={variant === "primary" ? "body-lg" : "body-sm"}
              sx={{ fontWeight: 300 }}
            >
              <Typography sx={{ fontWeight: 500 }}>Relevance: </Typography>{" "}
              {philosophy.relevance}
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

import React from "react";
import { Box, Typography, Chip } from "@mui/joy";

interface UserBasicProps {
  reflectionCount: number;
  isPremium: boolean;
}

const UserBasic: React.FC<UserBasicProps> = ({
  reflectionCount,
  isPremium,
}) => {
  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography level="body-lg">Reflections: {reflectionCount}</Typography>
      <Chip
        variant={isPremium ? "solid" : "outlined"}
        color={isPremium ? "primary" : "neutral"}
        sx={{ marginTop: 1 }}
      >
        {isPremium ? "Premium Account" : "Free Account"}
      </Chip>
    </Box>
  );
};

export default UserBasic;

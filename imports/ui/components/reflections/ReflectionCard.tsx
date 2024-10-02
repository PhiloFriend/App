import React from "react";
import { Box, Typography } from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { Reflection } from "/imports/api/Reflection";

interface ReflectionCardProps {
  reflection: Reflection;
}

export const ReflectionCard: React.FC<ReflectionCardProps> = ({
  reflection,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/reflections/${reflection._id}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "4px",
        p: 2,
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          background: "primary.100",
        },
      }}
    >
      <Typography level="body-sm" mb={1}>
        {reflection.createdAt.toLocaleDateString()}
      </Typography>
      {reflection.result?.image && (
        <Box
          component="img"
          src={reflection.result.image}
          alt="Reflection"
          sx={{ width: "100%", height: "100%", objectFit: "cover", mb: 1 }}
        />
      )}
      <Typography level="body-md" noWrap>
        {reflection.result?.reflection || "No summary available"}
      </Typography>
    </Box>
  );
};

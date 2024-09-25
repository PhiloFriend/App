import React from "react";
import { Box, Typography, Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

interface UserPhilosophiesProps {
  MyPhilosophiesSelector: React.FC;
}

const UserPhilosophies: React.FC<UserPhilosophiesProps> = ({ MyPhilosophiesSelector }) => {
  const navigate = useNavigate();

  const handleChangeClick = () => {
    navigate("/change-philosophies");
  };

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography level="h4">Your Philosophies</Typography>
        <Button variant="plain" onClick={handleChangeClick}>
          Change
        </Button>
      </Box>
      <Box>
        <MyPhilosophiesSelector />
      </Box>
    </Box>
  );
};

export default UserPhilosophies;

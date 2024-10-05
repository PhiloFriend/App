import React from "react";
import { Box, Typography, Button, Card } from "@mui/joy";
import { useNavigate } from "react-router-dom";

interface OutOfCreditNotificationProps {
  onUpgrade: () => void;
}

export const OutOfCreditNotification: React.FC<
  OutOfCreditNotificationProps
> = ({ onUpgrade }) => {
  const navigate = useNavigate();

  const handleWaitUntilNextWeek = () => {
    navigate("/");
  };

  return (
    <Box>
      <Typography level="h2" sx={{ mb: 2 }}>
        🔮 Your Reflection Journey Paused 🔮
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Even the greatest magicians take a moment to recharge their powers.
        You've reached your reflection limit for this week, but worry not—the
        magic resumes in seven days with three fresh credits ready to guide your
        introspection.
      </Typography>
      <Box
        sx={{ bgcolor: "background.level1", p: 2, borderRadius: "sm", mb: 2 }}
      >
        <Typography level="body-sm" sx={{ fontStyle: "italic" }}>
          Imagine a realm where your reflections are limitless. Our Premium
          Membership offers 100 credits, granting you unrestricted access to
          profound insights and continuous self-discovery. Step into the full
          magic of your potential.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="outlined"
          color="neutral"
          onClick={handleWaitUntilNextWeek}
          startDecorator="🌟"
        >
          Wait Until Next Week
        </Button>
        <Button
          variant="solid"
          color="primary"
          onClick={onUpgrade}
          startDecorator="🪄"
        >
          Upgrade to Premium
        </Button>
      </Box>
    </Box>
  );
};

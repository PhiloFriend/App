import React, { useState } from "react";
import { Box, Typography, Button, Alert, IconButton } from "@mui/joy";
import { Meteor } from "meteor/meteor";
import { CloseRounded } from "@mui/icons-material";
// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";

export const EmailVerificationPanel: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const user = useTracker(() => Meteor.user());
  const isGoogleUser = user && user.services && user.services.google;

  const handleResendVerification = () => {
    if (isGoogleUser) return; // Don't attempt to resend for Google users

    setIsResending(true);
    setResendStatus("idle");
    Meteor.call("sendVerificationEmail", (error: Error | null) => {
      setIsResending(false);
      if (error) {
        console.error("Error resending verification email:", error);
        setResendStatus("error");
      } else {
        setResendStatus("success");
      }
    });
  };

  if (isGoogleUser) return null; // Don't render the panel for Google users

  return (
    <Box
      sx={{
        backgroundColor: "primary.50",
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography level="body-sm">
        Verify your email to get more reflection credits every week.
      </Typography>
      <Button
        variant="soft"
        color="neutral"
        size="sm"
        onClick={handleResendVerification}
        disabled={isResending}
      >
        {isResending ? "Sending..." : "Resend verification email"}
      </Button>
      {resendStatus === "success" && (
        <Alert
          color="success"
          sx={{ mt: 1, position: "fixed", bottom: 25, zIndex: 10000 }}
          endDecorator={
            <IconButton
              variant="soft"
              color="success"
              onClick={() => setResendStatus("idle")}
            >
              <CloseRounded />
            </IconButton>
          }
        >
          Verification email sent successfully!
        </Alert>
      )}
      {resendStatus === "error" && (
        <Alert
          color="danger"
          sx={{ mt: 1, position: "fixed", bottom: 25, zIndex: 10000 }}
          endDecorator={
            <IconButton
              variant="soft"
              color="success"
              onClick={() => setResendStatus("idle")}
            >
              <CloseRounded />
            </IconButton>
          }
        >
          Failed to send verification email. Please try again.
        </Alert>
      )}
    </Box>
  );
};

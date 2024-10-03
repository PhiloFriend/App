import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Box, Typography, Alert } from "@mui/joy";

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");

  useEffect(() => {
    if (token) {
      Accounts.verifyEmail(token, (error) => {
        if (error) {
          console.error("Verification error:", error);
          setVerificationStatus("error");
        } else {
          setVerificationStatus("success");
        }
      });
    }
  }, [token]);

  return (
    <Box sx={{ padding: 4, textAlign: "center" }}>
      {verificationStatus === "verifying" && (
        <Typography>Verifying your email...</Typography>
      )}
      {verificationStatus === "success" && (
        <Alert color="success">
          Your email has been verified successfully!
        </Alert>
      )}
      {verificationStatus === "error" && (
        <Alert color="danger">
          There was an error verifying your email. Please try again or contact support.
        </Alert>
      )}
    </Box>
  );
};

export default EmailVerification;
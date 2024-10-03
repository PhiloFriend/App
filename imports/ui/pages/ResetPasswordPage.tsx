import React, { useState } from "react";
import { Accounts } from "meteor/accounts-base";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Input, Button, FormControl, FormLabel, Alert } from "@mui/joy";

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    Accounts.resetPassword(token || "", password, (error) => {
      if (error) {
        console.error("Error resetting password:", error);
        setStatus("error");
      } else {
        setStatus("success");
        setTimeout(() => navigate("/"), 3000); // Redirect to home after 3 seconds
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography level="h4" component="h1" sx={{ mb: 2 }}>
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ mb: 2 }}>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" fullWidth>
          Set New Password
        </Button>
      </form>
      {status === "success" && (
        <Alert color="success" sx={{ mt: 2 }}>
          Password reset successfully. Redirecting to home page...
        </Alert>
      )}
      {status === "error" && (
        <Alert color="danger" sx={{ mt: 2 }}>
          Failed to reset password. Please try again.
        </Alert>
      )}
    </Box>
  );
};

export default ResetPasswordPage;
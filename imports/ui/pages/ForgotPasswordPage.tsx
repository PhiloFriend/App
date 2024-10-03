import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Box, Typography, Input, Button, FormControl, FormLabel, Alert } from "@mui/joy";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("idle");
    Meteor.call("sendResetPasswordEmail", email, (error: Error | null) => {
      if (error) {
        console.error("Error sending reset password email:", error);
        setStatus("error");
      } else {
        setStatus("success");
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography level="h4" component="h1" sx={{ mb: 2 }}>
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ mb: 2 }}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" fullWidth>
          Reset Password
        </Button>
      </form>
      {status === "success" && (
        <Alert color="success" sx={{ mt: 2 }}>
          Password reset email sent. Please check your inbox.
        </Alert>
      )}
      {status === "error" && (
        <Alert color="danger" sx={{ mt: 2 }}>
          Failed to send reset email. Please try again.
        </Alert>
      )}
    </Box>
  );
};

export default ForgotPasswordPage;
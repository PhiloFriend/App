import React, { useState } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  Grid,
  Input,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/joy";
import { Logo } from "../../components/common/Logo";
import { Apple, Facebook, Google } from "@mui/icons-material";
import { SignupForm } from "../features/authentication/SignupForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useReflectionContext } from "../../contexts/ReflectionContext";

const SignUp: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const philosophies: Array<string> = searchParams.getAll("philosophy");

  const navigate = useNavigate();
  const { storedReflectionInput } = useReflectionContext();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 70px)",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "1200px" }}>
        <Grid container sx={{ height: "100%" }}>
          <Grid
            sm={6}
            xs={12}
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              background: "#fcfcfc",
              borderRight: 0,
            }}
          >
            <Box sx={{ minHeight: "40em" }}>
              <Box sx={{ paddingTop: "2em", maxWidth: 400, margin: "auto" }}>
                <Typography level="h2" sx={{ fontWeight: 400, mb: 0.5 }}>
                  Welcome to <Logo />
                </Typography>
                <Typography level="body-lg">
                  Discover your life philosophy and grow with personalized
                  wisdom.
                </Typography>
              </Box>
              <Box sx={{ padding: "2em", height: "100%" }}>
                <Stack spacing={2} sx={{ maxWidth: 400, margin: "auto" }}>
                  {storedReflectionInput && (
                    <Alert color="warning">
                      Sign up to see the result of your reflection!
                    </Alert>
                  )}
                  <SignupForm philosophies={philosophies ? philosophies : []} />

                  <Typography level="body-sm" textAlign="center">
                    Already have an account?{" "}
                    <Typography
                      onClick={() => navigate("/login")}
                      level="body-sm"
                      textAlign="center"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      fontWeight={700}
                    >
                      Log in
                    </Typography>
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Grid>
          <Grid
            xs={0}
            sm={6}
            sx={{
              backgroundImage: 'url("/nietzscheism.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: { xs: "200px", sm: "auto" },
            }}
          ></Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignUp;

import React from "react";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/joy";
import { Logo } from "../../components/common/Logo";
import { Apple, Facebook, Google } from "@mui/icons-material";
import { LoginForm } from "../features/authentication/LoginForm";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // Add your Google sign-in logic here
  };

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
                  Welcome back to <Logo />
                </Typography>
                <Typography level="body-lg">
                  Log in to continue your journey of wisdom and growth.
                </Typography>
              </Box>
              <Box sx={{ padding: "2em", height: "100%" }}>
                <Stack spacing={2} sx={{ maxWidth: 400, margin: "auto" }}>
                  <LoginForm />

                  <Typography level="body-sm" textAlign="center">
                    Don't have an account?{" "}
                    <Typography
                      onClick={() => navigate("/signup")}
                      level="body-sm"
                      textAlign="center"
                      color="primary"
                      sx={{ cursor: "pointer" }}
                      fontWeight={700}
                    >
                      Sign up
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
              backgroundImage: 'url("/taoism.webp")',
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

export default Login;

import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

// @ts-ignore
import { useSubscribe } from "meteor/react-meteor-data";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import theme from "./theme";
import { Box } from "@mui/joy";

import { HeaderContainer } from "./containers/layout/HeaderContainer";
import { Footer } from "./components/layout/Footer";
import { EmailVerificationPanel } from "./components/EmailVerificationPanel";

import { HomePage } from "./pages/HomePage";
import SignUp from "./containers/layout/Signup";
import Login from "./containers/layout/Login"; // Add this import
import { ReflectionDetails } from "./containers/reflections/ReflectionDetails";
import { AboutPage } from "./pages/AboutPage";
import ReflectPage from "./pages/ReflectPage"; // Add this import
import EmailVerification from "./pages/EmailVerification"; // Create this component

import { Meteor } from "meteor/meteor";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import { UserStatus } from "./components/UserStatus";

const Layout = () => {
  const { user, isEmailVerified } = useTracker(() => {
    const userSub = Meteor.subscribe("userData");
    const user = Meteor.user();
    let isEmailVerified = false;

    if (user) {
      if (user.services?.google?.verified_email) {
        isEmailVerified = true;
      } else if (user.emails && user.emails[0].verified) {
        isEmailVerified = true;
      }
    }

    return {
      user,
      isEmailVerified,
      isLoading: !userSub.ready(),
    };
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <UserStatus>
        <HeaderContainer />
        {user && !isEmailVerified && <EmailVerificationPanel />}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        <Footer />
      </UserStatus>
    </Box>
  );
};

export const App = () => {
  useSubscribe("philosophies");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "signup", element: <SignUp /> },
        { path: "login", element: <Login /> }, // Add this line
        { path: "reflections/:id", element: <ReflectionDetails /> },
        { path: "about", element: <AboutPage /> },
        { path: "reflect", element: <ReflectPage /> }, // Add this line
        { path: "verify-email/:token", element: <EmailVerification /> },
        { path: "forgot-password", element: <ForgotPasswordPage /> },
        { path: "reset-password/:token", element: <ResetPasswordPage /> },
      ],
    },
  ]);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </CssVarsProvider>
  );
};

import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

// @ts-ignore
import { useSubscribe } from "meteor/react-meteor-data";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import theme from "./theme";
import { Box } from "@mui/joy";

import { HeaderContainer } from "./containers/layout/HeaderContainer";
import { Footer } from "./components/layout/Footer";

import { HomePage } from "./pages/HomePage";
import SignUp from "./containers/layout/Signup";
import { ReflectionDetails } from "./containers/reflections/ReflectionDetails";
import { AboutPage } from './pages/AboutPage';

const Layout = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <HeaderContainer />
    <Box component="main" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

export const App = () => {
  useSubscribe("philosophies");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "signup", element: <SignUp /> },
        { path: "reflections/:id", element: <ReflectionDetails /> },
        { path: "about", element: <AboutPage /> }, // Add this line
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

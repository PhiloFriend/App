import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

// @ts-ignore
import { useSubscribe } from "meteor/react-meteor-data";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import theme from "./theme";
import { Box } from "@mui/joy";

import { HeaderContainer } from "./containers/layout/HeaderContainer";

import { HomePage } from "./pages/HomePage";

import SignUp from "./containers/layout/Signup";

export const App = () => {
  useSubscribe("philosophies");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "signup",
      element: (
        <Box>
          <HeaderContainer />
          <SignUp />
        </Box>
      ),
    },
  ]);

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router}></RouterProvider>
    </CssVarsProvider>
  );
};

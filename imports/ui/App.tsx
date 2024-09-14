import React from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import theme from "./theme";

import { HeaderContainer } from "./containers/layout/HeaderContainer";
import { Hero } from "./components/layout/Hero";
import { Main } from "./components/layout/Main";


export const App = () => (
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <HeaderContainer />
    <Main>
      <Hero />
    </Main>{" "}
  </CssVarsProvider>
);

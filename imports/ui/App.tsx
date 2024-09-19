import React from "react";
// @ts-ignore
import { useSubscribe } from "meteor/react-meteor-data";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import theme from "./theme";
import { Box } from "@mui/joy";

import { HeaderContainer } from "./containers/layout/HeaderContainer";
import { Hero } from "./components/layout/Hero";
import { Main } from "./components/layout/Main";

import { PhilosophySelector } from "./containers/features/quizzes/PhilosopySelector";

export const App = () => {
  useSubscribe("philosophies");

  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <HeaderContainer />
      <Main>
        <Hero />
        <Box mt={10} />
        <PhilosophySelector />
      </Main>{" "}
    </CssVarsProvider>
  );
};

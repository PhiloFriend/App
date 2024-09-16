import React from "react";

import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import theme from "./theme";
import { Box } from "@mui/joy";

import { HeaderContainer } from "./containers/layout/HeaderContainer";
import { Hero } from "./components/layout/Hero";
import { Main } from "./components/layout/Main";

import { ChoosePhilosophyQuiz } from "./containers/features/quizzes/ChoosePhilosophyQuiz";

export const App = () => (
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <HeaderContainer />
    <Main>
      <Hero />
      <Box mt={10} />
      <ChoosePhilosophyQuiz />
    </Main>{" "}
  </CssVarsProvider>
);

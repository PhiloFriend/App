// HomePage.jsx
import React from "react";
import { Box } from "@mui/joy";

// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import { HeaderContainer } from "../containers/layout/HeaderContainer";
import { Hero } from "../components/layout/Hero";
import { Main } from "../components/layout/Main";
import { PhilosophySelector } from "../containers/features/quizzes/PhilosopySelector";
import { ReflectionQuiz } from "../containers/features/quizzes/ReflectionQuiz";

import { Dashboard } from "../containers/features/user/Dashboard";

export const HomePage = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <Box>
      <HeaderContainer />
      <Main>
        {user == null ? (
          <>
            <Hero />
            <Box mt={10} />
            <PhilosophySelector />
          </>
        ) : (
          <Dashboard />
        )}
        {/* For the logged-in user, render null for now */}
      </Main>
    </Box>
  );
};

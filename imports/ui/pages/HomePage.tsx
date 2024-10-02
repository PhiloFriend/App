// HomePage.jsx
import React from "react";
import { Box } from "@mui/joy";

// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

import { HeaderContainer } from "../containers/layout/HeaderContainer";
import { Hero } from "../components/layout/Hero";
import { Main } from "../components/layout/Main";
import { SecondaryInfo } from "../components/layout/SecondaryInfo";
import { Steps } from "../components/layout/Steps";

import { PhilosophySelector } from "../containers/features/quizzes/PhilosopySelector";
import { ReflectionQuiz } from "../containers/features/quizzes/ReflectionQuiz";

import { Dashboard } from "../containers/features/user/Dashboard";
import EmotionalQuiz from "../modules/new-quiz/EmotionalQuiz";

export const HomePage = () => {
  const userId = useTracker(() => Meteor.userId());

  return (
    <Box>
      <Main>
        {userId ? (
          <Dashboard />
        ) : (
          <>
            <Hero />
            <Box mt={10} />
            <SecondaryInfo />
            <Steps />
            <Box>
              <EmotionalQuiz />
            </Box>
          </>
        )}
      </Main>
    </Box>
  );
};

export default HomePage;

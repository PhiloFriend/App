// HomePage.jsx
import React, { useRef } from "react";
import { Box, Button } from "@mui/joy";
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
  const quizRef = useRef<HTMLDivElement>(null);

  const scrollToQuiz = () => {
    quizRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box>
      <Main>
        {userId ? (
          <Dashboard />
        ) : (
          <>
            <Hero onCtaClick={scrollToQuiz} />
            <Box mt={10} />
            <SecondaryInfo onCtaClick={scrollToQuiz} />
            <Steps />
            <Box ref={quizRef}>
              <EmotionalQuiz />
            </Box>
          </>
        )}
      </Main>
    </Box>
  );
};

export default HomePage;

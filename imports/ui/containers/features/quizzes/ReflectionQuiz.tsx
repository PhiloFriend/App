import { Meteor } from "meteor/meteor";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

import {
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  Button,
  Typography,
  Grid,
} from "@mui/joy";
import React, { useEffect, useState } from "react";

import { ReflectionQuizzesCollection } from "/imports/api/ReflectionQuiz";
import { QuizHeader } from "/imports/ui/components/features/quiz/QuizHeader";
import { Question } from "/imports/ui/components/features/quiz/Question";
import { QuizOptions } from "/imports/ui/components/features/quiz/QuizOptions";
import { QuizHistory } from "/imports/ui/components/features/quiz/QuizHistory";
import { Loader } from "/imports/ui/components/common/Loader";

const initialQuiz = {
  currentQuestion: "What was the most meaningful moment you experienced today?",
  currentOptions: {
    A: "Achieving a personal goal",
    B: "Connecting with someone special",
    C: "Overcoming a challenge",
    D: "Taking time to relax and reflect",
  },
  history: [],
};

interface ReflectionResultProps {
  result: {
    reflection: string;
    quote: string;
    story: string;
    application: string;
  };
}

export const ReflectionResult = ({ result }: ReflectionResultProps) => {
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid sm={6} xs={12}>
          <Typography mb={"1.5em"} level="body-lg">
            {result.quote}
          </Typography>
          <Typography mb={"0.5em"} level="h4">
            A Story:
          </Typography>{" "}
          <Typography mb={"1em"} level="body-md">
            {result.story}
          </Typography>
          <Typography mb={"0.5em"} level="h4">
            Application:
          </Typography>{" "}
          <Typography mb={"1em"} level="body-md">
            {result.application}
          </Typography>
        </Grid>
        <Grid sm={6} xs={12}>
          {" "}
          <Typography level="h4">Your Reflection:</Typography>{" "}
          <Typography level="body-sm">{result.reflection}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export const ReflectionQuiz = () => {
  const [quizId, setQuizId] = useState("");

  const subscription = useTracker(() => {
    const handle = Meteor.subscribe("reflectionQuiz", quizId);
    return handle;
  }, [quizId]);

  const quiz = useTracker(() => {
    return ReflectionQuizzesCollection.findOne({ _id: quizId });
  }, [quizId]);

  useEffect(() => {
    const createQuiz = async () => {
      //const quizId = await Meteor.callAsync(
      //  "reflectionQuizzes.create",
      //  initialQuiz.currentQuestion,
      //  initialQuiz.currentOptions,
      //  //@ts-ignore
      //  Meteor.user()?.profile.philosophies
      //);
      //
      //console.log("are we here?", quizId);
      setQuizId("ao7uw9LoEb3EqBbqa");
    };

    createQuiz();
  }, []);

  const effectiveQuiz = quiz ? quiz : initialQuiz;

  return (
    <Box>
      <QuizHeader
        title="Daily Reflection"
        questionNumber={quiz?.history ? quiz.history.length + 1 : 1}
        quizMaxQuestions={10}
      />
      {effectiveQuiz.currentQuestion && (
        <Question body={effectiveQuiz.currentQuestion} />
      )}

      {effectiveQuiz.currentOptions ? (
        <QuizOptions
          options={Object.values(effectiveQuiz.currentOptions)}
          onSelect={async (
            answerIndex: number,
            answerLetter: string,
            answerText: string
          ) => {
            console.log("w/??");
            if (quiz) {
              await Meteor.callAsync(
                "reflectionQuizzes.answerQuestion",
                quiz._id,
                `${answerLetter}. ${answerText}`
              );
            }
          }}
        />
      ) : effectiveQuiz.result ? null : (
        <Box
          sx={{
            minHeight: "300px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </Box>
      )}

      {effectiveQuiz.result && (
        <Box sx={{ mt: "2em" }}>
          <Tabs variant="plain" color="primary" defaultValue={0}>
            <TabList size="lg" disableUnderline>
              <Tab>Reflection</Tab>
              <Tab>Your Answers</Tab>
            </TabList>
            <TabPanel variant="plain" value={0}>
              <ReflectionResult result={quiz.result} />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="solid" color="primary" size="lg">
                  Continue your Journey
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value={1}>
              <QuizHistory history={effectiveQuiz.history} />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="solid" color="primary" size="lg">
                  Continue your Journey
                </Button>
              </Box>
            </TabPanel>
          </Tabs>
        </Box>
      )}
    </Box>
  );
};

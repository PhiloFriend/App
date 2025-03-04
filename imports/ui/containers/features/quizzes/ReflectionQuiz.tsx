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
import React, { useEffect, useState, useCallback } from "react";
//@ts-ignore
import { saveAs } from "file-saver";

import { ReflectionQuizzesCollection } from "/imports/api/ReflectionQuiz";
import { QuizHeader } from "/imports/ui/components/features/quiz/QuizHeader";
import { Question } from "/imports/ui/components/features/quiz/Question";
import { QuizOptions } from "/imports/ui/components/features/quiz/QuizOptions";
import { QuizHistory } from "/imports/ui/components/features/quiz/QuizHistory";
import { Loader } from "/imports/ui/components/common/Loader";

const initialQuiz = {
  currentQuestion:
    "Which of the following best captures how you felt throughout today?",
  currentOptions: {
    A: "Joyful and content",
    B: "Calm and peaceful",
    C: "Anxious or stressed",
    D: "Sad or down",
    E: "Frustrated or angry",
    F: "Disconnected or numb",
  },
  history: [],
};

interface ReflectionResultProps {
  result: {
    reflection: string;
    quote: string;
    story: string;
    application: string;
    sharableCaption: string;
    image: string;
  };
}

export const ReflectionResult = ({ result }: ReflectionResultProps) => {
  const handleDownload = useCallback(() => {
    console.log("???");

    if (result.image) {
      saveAs(result.image, `reflection-${new Date().toISOString()}.png`);
    }
  }, [result.image]);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid sm={4} xs={12}>
          <img src={result.image} style={{ width: "100%" }} alt="Reflection" />
          <Typography mb={"1.5em"} level="body-md">
            {result.quote}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="primary"
                  size="md"
                  onClick={handleDownload}
                >
                  Download Image
                </Button>
              </Grid>
              <Grid xs={6}>
                <Button
                  disabled
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="md"
                >
                  Join Act I
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid sm={8} xs={12}>
          <Typography mb={"0.5em"} level="h4">
            Your Reflection:
          </Typography>{" "}
          <Typography mb={"1em"} level="body-md">
            {result.reflection}
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
          <Typography mb={"0.5em"} level="h4">
            Sharable Caption:
          </Typography>{" "}
          <Typography mb={"1em"} level="body-md">
            {result.sharableCaption}
          </Typography>
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
      const quizId = await Meteor.callAsync(
        "reflectionQuizzes.create",
        initialQuiz.currentQuestion,
        initialQuiz.currentOptions,
        //@ts-ignore
        Meteor.user()?.profile.philosophies
      );

      console.log("are we here?", quizId);
      //setQuizId("fT4KKeH5XCFvywdfb");
      setQuizId(quizId);
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

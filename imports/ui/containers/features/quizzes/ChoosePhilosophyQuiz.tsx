import { Meteor } from "meteor/meteor";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

import { Box, Tabs, Tab, TabList, TabPanel, Button } from "@mui/joy";
import React, { useEffect, useState } from "react";

import { QuizzesCollection } from "/imports/api/Quiz";
import { QuizHeader } from "/imports/ui/components/features/quiz/QuizHeader";
import { Question } from "/imports/ui/components/features/quiz/Question";
import { QuizOptions } from "/imports/ui/components/features/quiz/QuizOptions";
import { ChoosePhilosophyResult } from "/imports/ui/components/features/quiz/ChoosePhilosophyResult";
import { QuizHistory } from "/imports/ui/components/features/quiz/QuizHistory";
import { Loader } from "/imports/ui/components/common/Loader";


//const initialQuiz = {
//  currentQuestion:
//    "When faced with a difficult decision, what guiding principle do you most rely on?",
//  currentOptions: {
//    A: "I trust my intuition and go with what feels right in the moment.",
//    B: "I carefully weigh the pros and cons to make the most logical choice.",
//    C: "I consider how my decision will impact others and strive for the greater good.",
//    D: "I follow established rules or traditions that have stood the test of time.",
//  },
//  history: [],
//};
//
const initialQuiz = {
  currentQuestion:
    "When making an important ethical decision, what do you consider to be the most crucial factor?",
  currentOptions: {
    A: "The potential consequences of your actions on yourself and others.",
    B: "Following established moral rules or principles.",
    C: "Acting in a way that aligns with your personal virtues and character.",
    D: "Considering the greater good for society as a whole.",
  },
  history: [],
};

export const ChoosePhilosophyQuiz = () => {
  const [quizId, setQuizId] = useState("");

  console.log("wtf is happening?");

  const subscription = useTracker(() => {
    const handle = Meteor.subscribe("quiz", quizId);
    return handle;
  }, [quizId]);

  const quiz = useTracker(() => {
    console.log("are we calling from here?");
    return QuizzesCollection.findOne({ _id: quizId });
  }, [quizId]);

  useEffect(() => {
    const createQuiz = async () => {
      const quizId = await Meteor.callAsync(
        "quizzes.create",
        initialQuiz.currentQuestion,
        initialQuiz.currentOptions
      );

      setQuizId(quizId);
    };

    createQuiz();
  }, []);

  const effectiveQuiz = quiz ? quiz : initialQuiz;

  console.log(quiz);

  return (
    <Box>
      <QuizHeader
        title="The Wisdom Compass"
        questionNumber={quiz?.history ? quiz.history?.length + 1 : 1}
        quizMaxQuestions={15}
      ></QuizHeader>
      {effectiveQuiz.currentQuestion ? (
        <Question body={effectiveQuiz.currentQuestion} />
      ) : null}

      {effectiveQuiz.currentOptions ? (
        <QuizOptions
          options={Object.values(effectiveQuiz.currentOptions)}
          onSelect={async (
            answerIndex: number,
            answerLetter: string,
            answerText: string
          ) => {
            if (quiz) {
              const quizId = await Meteor.callAsync(
                "quizzes.answerQuestion",
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

      {effectiveQuiz.result ? (
        <Box sx={{ mt: "2em" }}>
          <Tabs variant="plain" color="primary" defaultValue={0}>
            <TabList size="lg" disableUnderline>
              <Tab>Result</Tab>
              <Tab>Your Answers</Tab>
            </TabList>
            <TabPanel variant="plain" value={0}>
              <ChoosePhilosophyResult result={quiz.result} />
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
      ) : null}
    </Box>
  );
};

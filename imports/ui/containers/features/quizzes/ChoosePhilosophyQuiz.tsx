import { Meteor } from "meteor/meteor";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

import { Box } from "@mui/joy";
import React, { useEffect, useState } from "react";

import { QuizzesCollection } from "/imports/api/Quiz";
import { QuizHeader } from "/imports/ui/components/features/quiz/QuizHeader";
import { Question } from "/imports/ui/components/features/quiz/Question";
import { QuizOptions } from "/imports/ui/components/features/quiz/QuizOptions";
import { ChoosePhilosophyResult } from "/imports/ui/components/features/quiz/ChoosePhilosophyResult";

const initialQuiz = {
  currentQuestion:
    "When faced with a difficult decision, what guiding principle do you most rely on?",
  currentOptions: {
    A: "I trust my intuition and go with what feels right in the moment.",
    B: "I carefully weigh the pros and cons to make the most logical choice.",
    C: "I consider how my decision will impact others and strive for the greater good.",
    D: "I follow established rules or traditions that have stood the test of time.",
  },
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
      //const quizId = await Meteor.callAsync(
      //  "quizzes.create",
      //  initialQuiz.currentQuestion,
      //  initialQuiz.currentOptions
      //);

      setQuizId("gieaK7haFwXqeGw8b");
    };

    createQuiz();
  }, []);

  const effectiveQuiz = quiz ? quiz : initialQuiz;

  console.log(quiz, effectiveQuiz.options);

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
      ) : null}
      {effectiveQuiz.result ? (
        <ChoosePhilosophyResult result={quiz.result} />
      ) : null}
    </Box>
  );
};

import React, { useEffect, useState } from "react";
import QuizHistoryFlow from "./QuizHistoryFlow";
import quizData from "./quiz-data.json"; // Your quiz data
import { QuizService } from "./QuizService";
import { Quiz } from "./Quiz";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { ReflectionCollection } from "/imports/api/Reflection";
import { ReflectionResult } from "../../containers/features/quizzes/ReflectionQuiz";
import { Question, Option } from "./types";
import { Loader } from "../../components/common/Loader";
import { Box, Typography } from "@mui/joy";

const quizService = new QuizService(quizData.questions as Question[]);

export function EmotionalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    quizService.getCurrentQuestion()
  );
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const subscription = quizService.canGoBack$.subscribe((v) => {
      setCanGoBack(v);
    });
    return () => subscription.unsubscribe();
  }, [quizService]);

  const handleOptionSelect = (option: Option) => {
    quizService.answerCurrentQuestion(option);
    const nextQuestion = quizService.getCurrentQuestion();
    setCurrentQuestion(nextQuestion);
  };

  const handleBack = () => {
    quizService.goBack();
    const previousQuestion = quizService.getCurrentQuestion();
    setCurrentQuestion(previousQuestion);
  };

  const [reflectionId, setReflectionId] = useState("");

  const subscription = useTracker(() => {
    const handle = Meteor.subscribe("reflection", reflectionId);
    return handle;
  }, [reflectionId]);

  const reflection = useTracker(() => {
    if (reflectionId) {
      return ReflectionCollection.findOne({ _id: reflectionId });
    } else {
      return null;
    }
  }, [reflectionId]);

  useEffect(() => {
    const main = async () => {
      console.log("are we here?", currentQuestion);
      if (!currentQuestion) {
        console.log(
          "creating emotional reflection",
          quizService.getAnswerArray()
        );
        const reflectionId = await Meteor.callAsync(
          "reflection.create",
          quizService.getAnswerArray(),
          "Emotional"
        );

        console.log("reflection id is", reflectionId);
        setReflectionId(reflectionId);
      }
    };

    main();
  }, [currentQuestion]);

  return (
    <div>
      {reflection ? (
        <ReflectionResult result={reflection.result} />
      ) : !currentQuestion ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 70px)",
            width: "100%",
          }}
        >
          <Box>
            <Box mb={2} sx={{ display: "flex", justifyContent: "center" }}>
              <Loader />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography level="body-lg">
                Processing your reflection...
              </Typography>
              <Typography level="body-sm">Could take a while</Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Quiz
          handleOptionSelect={handleOptionSelect}
          currentQuestion={currentQuestion}
          handleBack={handleBack}
          quizService={quizService}
          canGoBack={canGoBack}
        />
      )}
    </div>
  );
}

export default EmotionalQuiz;

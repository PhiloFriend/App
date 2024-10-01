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
import { Box, Button, Textarea, Typography } from "@mui/joy";
import OptionsWrapper from "./OptionsWrapper";
import { Option as OptionComponent } from "./Option";

const quizService = new QuizService(quizData.questions as Question[]);

export function EmotionalQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    quizService.getCurrentQuestion()
  );

  const [step, setStep] = useState<number>(0);
  const [selfReflect, setSelfReflect] = useState<string>("");

  const [finalized, setFinalize] = useState<boolean>(false);

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
    setStep(step - 1);
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

    //main();
  }, [currentQuestion]);

  const handleSubmit = async () => {
    setFinalize(true);
    if (!currentQuestion) {
      console.log(
        "creating emotional reflection",
        quizService.getAnswerArray()
      );
      const reflectionId = await Meteor.callAsync(
        "reflection.create",
        [
          ...quizService.getAnswerArray(),
          `Is there anything more to add? ${selfReflect}`,
        ],
        "Emotional"
      );

      console.log("reflection id is", reflectionId);
      setReflectionId(reflectionId);
    }
  };

  return (
    <div>
      {reflection ? (
        <ReflectionResult result={reflection.result} />
      ) : !currentQuestion && finalized ? (
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
          currentQuestion={
            currentQuestion ? (
              <>
                <Typography level="h2" sx={{ mb: 2 }}>
                  {currentQuestion?.title}
                </Typography>
                {currentQuestion?.description && (
                  <Typography level="body-lg" sx={{ mb: 2 }}>
                    {currentQuestion.description}
                  </Typography>
                )}
                <OptionsWrapper
                  options={
                    currentQuestion?.options
                      ? currentQuestion?.options?.map((option) => (
                          <OptionComponent
                            key={option.title}
                            option={option}
                            onClick={(option: Option) => {
                              handleOptionSelect(option);
                              setStep(step + 1);
                            }}
                          />
                        ))
                      : []
                  }
                />
              </>
            ) : (
              <Box>
                <Typography level="h4" mb={2}>
                  You've completed the main questions. Is there anything else
                  you'd like to add?
                </Typography>
                <Textarea
                  minRows={3}
                  maxRows={6}
                  placeholder="Your additional thoughts (optional)"
                  value={selfReflect}
                  onChange={(e) => setSelfReflect(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="solid" color="primary" onClick={handleSubmit}>
                  Submit and Get Wisdom
                </Button>
                <Typography level="body-sm" mt={1}>
                  You can leave the text box empty if you have nothing more to
                  add.
                </Typography>
              </Box>
            )
          }
          handleBack={handleBack}
          quizService={quizService}
          canGoBack={canGoBack}
          step={step}
        />
      )}
    </div>
  );
}

export default EmotionalQuiz;

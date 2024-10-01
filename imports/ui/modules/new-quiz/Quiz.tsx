// Quiz.tsx

import React, { useEffect, useState } from "react";
import { QuizService } from "./QuizService";
import { Question, Option } from "./types";
import { Question as QuestionRenderer } from "./Question";
import { Button } from "@mui/joy";

interface QuizProps {
  quizService: QuizService;
  currentQuestion: React.ReactNode;
  handleOptionSelect: (option: Option) => void;
  handleBack: () => void;
  canGoBack: boolean;
  step: number;
}

export const Quiz: React.FC<QuizProps> = ({
  quizService,
  currentQuestion,
  handleBack,
  handleOptionSelect,
  canGoBack,
  step,
}) => {

  return (
    <div>
      {currentQuestion ? (
        <>
          {canGoBack ? (
            <Button
              sx={{ mb: "1em" }}
              onClick={handleBack}
              disabled={!canGoBack}
            >
              Back
            </Button>
          ) : null}
          <QuestionRenderer
            currentQuestion={currentQuestion}
            step={step}
          />
          {/*         <h2>{currentQuestion.title}</h2>
          <p>{currentQuestion.description}</p>
          <div>
            {currentQuestion.options.map((option) => (
              <button
                key={option.title}
                onClick={() => handleOptionSelect(option)}
              >
                {option.title}
              </button>
            ))}
          </div> */}
        </>
      ) : (
        <div>Thank you for completing the quiz!</div>
      )}
    </div>
  );
};

export default Quiz;

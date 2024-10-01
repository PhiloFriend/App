import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { Option } from "./Option";
import { OptionsWrapper } from "./OptionsWrapper";
import { Option as OptionType, Question as QuestionType } from "./types";

interface QuestionProps {
  currentQuestion: React.ReactNode;
  step: number;
  //handleOptionSelect: (option: OptionType) => void;
}

export const Question: React.FC<QuestionProps> = ({
  currentQuestion,
  step,
  //handleOptionSelect,
}) => {
  const [displayedQuestion, setDisplayedQuestion] = useState<
    React.ReactNode | undefined
  >(undefined);
  const [animationState, setAnimationState] = useState("enter");
  const [lastStep, setLastStep] = useState(0);

  useEffect(() => {
    if (lastStep !== step) {
      setLastStep(step);
      if (displayedQuestion) {
        // Start exit animation
        console.log("start exit animation");
        setAnimationState("exit");

        // After exit animation, update displayed question
        setTimeout(() => {
          setDisplayedQuestion(currentQuestion);
          setAnimationState("enter");
          console.log("end exit animation");
        }, 600); // Half of the animation duration
      } else {
        // Initial load
        setDisplayedQuestion(currentQuestion);
      }
    } else {
      setDisplayedQuestion(currentQuestion);
    }
  }, [currentQuestion, displayedQuestion, step]);

  if (!displayedQuestion) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          transform:
            animationState === "enter" ? "translateX(0%)" : "translateX(-100%)",
          opacity: animationState === "enter" ? 1 : 0,
          transition: "transform 0.6s ease-in-out, opacity 0.6s ease-in-out",
        }}
      >
        {displayedQuestion}
      </Box>
    </Box>
  );
};

export default Question;

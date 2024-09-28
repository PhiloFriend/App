import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/joy";
import { Option } from "./Option";
import { OptionsWrapper } from "./OptionsWrapper";
import { Option as OptionType, Question as QuestionType } from "./types";

interface QuestionProps {
  currentQuestion: QuestionType;
  handleOptionSelect: (option: OptionType) => void;
}

export const Question: React.FC<QuestionProps> = ({
  currentQuestion,
  handleOptionSelect,
}) => {
  const [displayedQuestion, setDisplayedQuestion] = useState<
    QuestionType | undefined
  >(undefined);
  const [animationState, setAnimationState] = useState("enter");

  useEffect(() => {
    if (currentQuestion !== displayedQuestion) {
      if (displayedQuestion) {
        // Start exit animation
        setAnimationState("exit");

        // After exit animation, update displayed question
        setTimeout(() => {
          setDisplayedQuestion(currentQuestion);
          setAnimationState("enter");
        }, 600); // Half of the animation duration
      } else {
        // Initial load
        setDisplayedQuestion(currentQuestion);
      }
    }
  }, [currentQuestion, displayedQuestion]);

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
        <Typography level="h2" sx={{ mb: 2 }}>
          {displayedQuestion.title}
        </Typography>
        {displayedQuestion.description && (
          <Typography level="body-lg" sx={{ mb: 2 }}>
            {displayedQuestion.description}
          </Typography>
        )}
        <OptionsWrapper
          options={displayedQuestion.options.map((option) => (
            <Option
              key={option.title}
              option={option}
              onClick={handleOptionSelect}
            />
          ))}
        />
      </Box>
    </Box>
  );
};

export default Question;

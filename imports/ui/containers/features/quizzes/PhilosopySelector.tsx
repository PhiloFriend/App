import React, { useState } from "react";
import { Box, Typography } from "@mui/joy";

import { FullTab } from "/imports/ui/components/common/tabs/FullTab";

import { ChoosePhilosophyQuiz } from "./ChoosePhilosophyQuiz";
import { ChoosePhilosophyManually } from "./ChoosePhilosophyManuall";

export const PhilosophySelector = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      title: "Take a quiz",
      description: `Not sure where to start? Our quiz analyzes your values and beliefs to suggest philosophies that might resonate with you.`,
      image: "/take-a-quiz.jpg",
    },
    {
      title: "Choose Manually",
      description: `If you already know what is your main philosophy of life, you can select it manually instead of taking the quiz`,
      image: "/select-manually.jpg",
    },
  ];

  return (
    <div>
      <Typography sx={{ mb: "0.5em" }} level="h1">
        Discover Your Life Philosophy
      </Typography>
      <Typography sx={{ mb: "1.5em" }} level="body-lg">
        Your philosophy of life is the set of beliefs, values, and principles
        that guide your decisions and shape your worldview. It's your personal
        approach to understanding the world and your place in it. Whether you're
        conscious of it or not, this philosophy influences how you face
        challenges, interact with others, and find meaning in your everyday
        experiences. Exploring and defining your life philosophy can lead to
        greater self-awareness, more intentional living, and a deeper sense of
        purpose.
      </Typography>
      <FullTab
        tabs={tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <Box sx={{ mb: "2em" }} />
      {selectedTab === 0 ? (
        <ChoosePhilosophyQuiz />
      ) : (
        <ChoosePhilosophyManually />
      )}
    </div>
  );
};

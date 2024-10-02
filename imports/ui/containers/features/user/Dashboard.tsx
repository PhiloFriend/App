import React from "react";
import { Grid, Box } from "@mui/joy";
import UserBasic from "../../../components/features/user/UserBasic";
import UserPhilosophies from "../../../components/features/user/UserPhilosophies";
import MyPhilosophiesSelector from "./MyPhilosophiesSelector";

import { EmotionalQuiz } from "../../../modules/new-quiz/EmotionalQuiz";
import { MyReflections } from "/imports/ui/containers/reflections/MyReflections";

export const Dashboard: React.FC = () => {
  // Example data, in a real application this would come from a state or props
  const reflectionCount = 42;
  const isPremium = true;

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid xs={12} sm={12}>
          <MyReflections />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

import React from "react";
import { Grid, Box } from "@mui/joy";
import UserBasic from "../../../components/features/user/UserBasic";
import UserPhilosophies from "../../../components/features/user/UserPhilosophies";
import MyPhilosophiesSelector from "./MyPhilosophiesSelector";

export const Dashboard: React.FC = () => {
  // Example data, in a real application this would come from a state or props
  const reflectionCount = 42;
  const isPremium = true;
  const philosophies = ["Stoicism", "Existentialism", "Minimalism"];

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <Box>
            <UserBasic
              reflectionCount={reflectionCount}
              isPremium={isPremium}
            />
            <Box mt={2} />
            <UserPhilosophies
              MyPhilosophiesSelector={() => (
                <MyPhilosophiesSelector philosophies={philosophies} />
              )}
            />
          </Box>
        </Grid>
        <Grid xs={8}>
          <Box>{/* Right side content goes here */}</Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

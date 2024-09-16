import React from "react";
import { ChoosePhilosophyResultType } from "/imports/ui/types";
import { PhilosophyItemBasic } from "../philosophy/PhilosophyItemBasic";
import { Box, Grid } from "@mui/joy";

interface ChoosePhilosophyResultProps {
  result: ChoosePhilosophyResultType;
}

export const ChoosePhilosophyResult = ({
  result,
}: ChoosePhilosophyResultProps) => {
  return (
    <Box mt="2em">
      <Grid spacing={4} container>
        <Grid md={6}>
          {" "}
          <PhilosophyItemBasic philosophy={result.primary} variant="primary" />
        </Grid>
        <Grid md={6}>
          <PhilosophyItemBasic
            philosophy={result.complementary[0]}
            variant="complementary"
          />
          <PhilosophyItemBasic
            philosophy={result.complementary[1]}
            variant="complementary"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

import React from "react";
import { ChoosePhilosophyResultType } from "/imports/ui/types";
import { PhilosophyItemBasic } from "../philosophy/PhilosophyItemBasic";
import { Box, Grid, Typography } from "@mui/joy";

interface ChoosePhilosophyResultProps {
  result: ChoosePhilosophyResultType;
}

export const ChoosePhilosophyResult = ({
  result,
}: ChoosePhilosophyResultProps) => {
  return (
    <Box mt="2em">
      <Grid spacing={16} container>
        <Grid md={6}>
          <Typography mb={"0.75em"} level="h2">
            Primary Philosophy
          </Typography>{" "}
          <Typography mb={"2.5em"} level="body-sm">
            Your primary philosophy forms the core of your worldview. It's the
            main lens through which you interpret life and make decisions. This
            philosophy resonates most strongly with your values and natural
            tendencies.
          </Typography>
          <PhilosophyItemBasic philosophy={result.primary} variant="primary" />
        </Grid>
        <Grid md={6}>
          <Typography mb={"0.75em"} level="h2">
            Complementary Philosophies
          </Typography>
          <Typography mb={"2.5em"} level="body-sm">
            These are two additional philosophies that enhance and balance your
            primary philosophy. They provide supplementary perspectives and
            practices, helping you develop a more comprehensive approach to
            life's challenges and opportunities.
          </Typography>
          <PhilosophyItemBasic
            philosophy={result.complementary[0]}
            variant="complementary"
          />
          <Box mb="1em"></Box>
          <PhilosophyItemBasic
            philosophy={result.complementary[1]}
            variant="complementary"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

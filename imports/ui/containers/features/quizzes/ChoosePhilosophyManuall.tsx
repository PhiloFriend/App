import { Meteor } from "meteor/meteor";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

import React from "react";
import { Box, Grid, Typography } from "@mui/joy";

import {
  PhilosophyCollection,
  PhilosophyType,
} from "/imports/api/Philosophies";
import { PhilosophySmallItem } from "/imports/ui/components/features/philosophy/PhilosophySmallItem";
import { PhilosophyItemBasic } from "/imports/ui/components/features/philosophy/PhilosophyItemBasic";

interface CategorizedPhilosophies {
  [category: string]: PhilosophyType[];
}

// Function to categorize philosophies
function categorizePhilosophies(
  philosophies: PhilosophyType[]
): CategorizedPhilosophies {
  return philosophies.reduce(
    (acc: CategorizedPhilosophies, philosophy: PhilosophyType) => {
      if (!acc[philosophy.category]) {
        acc[philosophy.category] = [];
      }
      acc[philosophy.category].push(philosophy);
      return acc;
    },
    {}
  );
}

// New helper function
function getSortedCategorizedPhilosophies(
  philosophies: PhilosophyType[]
): [string, PhilosophyType[]][] {
  const categorized = categorizePhilosophies(philosophies);
  return Object.entries(categorized).sort((a, b) => a[0].localeCompare(b[0]));
}

export const ChoosePhilosophyManually = () => {
  const philosophies = useTracker(() => {
    return PhilosophyCollection.find({}).fetch();
  }, []);

  const categorizedPhilosophies =
    getSortedCategorizedPhilosophies(philosophies);

  return (
    <Box sx={{ mt: "1em", padding: "0em" }}>
      <Grid container spacing={4}>
        <Grid md={6}>
          {categorizedPhilosophies.map((categories) => (
            <Box mb="1em">
              <Typography mb="0.5em" level="h3">
                {categories[0]}
              </Typography>
              <Grid container spacing={1}>
                {categories[1].map((philosophy) => (
                  <Grid xs={3}>
                    <PhilosophySmallItem
                      key={philosophy.id}
                      philosophy={philosophy}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Grid>
        <Grid md={6}>
          <Typography mb={"0.25em"} level="h2">
            Primary Philosophy
          </Typography>
          <Typography mb={"0.5em"} level="body-sm">
            Your primary philosophy forms the core of your worldview. It's the
            main lens through which you interpret life and make decisions. This
            philosophy resonates most strongly with your values and natural
            tendencies.
          </Typography>
          <PhilosophyItemBasic
            philosophy={{
              id: "stoicism",
              name: "Stoicism",
              explanation:
                "Ancient Chinese ethical and philosophical system developed by Confucius. Emphasizes personal and governmental morality, correctness of social relationships, and justice.",
              relevance: `            These are two additional philosophies that enhance and balance your
            primary philosophy. They provide supplementary perspectives and
            practices, helping you develop a more comprehensive approach to
`,
              application: "",
            }}
            variant="complementary"
          />

          <Box mb={"10em"} />
          <Typography mb={"0.25em"} level="h2">
            Complementary Philosophies
          </Typography>
          <Typography level="body-sm">
            These are two additional philosophies that enhance and balance your
            primary philosophy. They provide supplementary perspectives and
            practices, helping you develop a more comprehensive approach to
            life's challenges and opportunities.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

import { Meteor } from "meteor/meteor";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";

import React, { useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/joy";

import {
  PhilosophyCollection,
  PhilosophyType,
} from "/imports/api/Philosophies";
import { PhilosophySmallItem } from "/imports/ui/components/features/philosophy/PhilosophySmallItem";
import { PhilosophyItemBasic } from "/imports/ui/components/features/philosophy/PhilosophyItemBasic";

import { useManuallySelectedPhilosophies } from "../../../hooks/philosophies/useManuallySelectedPhilosophies";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const philosophies = useTracker(() => {
    return PhilosophyCollection.find({}).fetch();
  }, []);

  const {
    selectedPhilosophies,
    isSelected,
    selectPhilosophy,
    removePhilosophy,
    canSelectMore,
    isSelectionComplete,
    philosophiesToSelect,
  } = useManuallySelectedPhilosophies(philosophies);

  console.log(selectedPhilosophies);

  const categorizedPhilosophies =
    getSortedCategorizedPhilosophies(philosophies);

  return (
    <Box sx={{ mt: "1em", padding: "0em" }}>
      <Grid container spacing={4}>
        <Grid md={6}>
          <Typography mb="0.75em" level="h3">
            Embark on Your Philosophical Journey{" "}
          </Typography>
          <Typography mb="0.5em" level="body-lg">
            As you stand at the crossroads of wisdom, consider the myriad
            schools of thought that have shaped human understanding throughout
            the ages. From this rich tapestry of ideas, select three
            philosophies that resonate most deeply with your core values and
            worldview. These chosen paradigms will serve as the foundation of
            your unique philosophical blueprint, guiding you towards a life of
            deeper meaning and conscious living.
          </Typography>

          <Typography mb="2em" level="body-lg">
            Choose wisely, for these philosophies will be your companions in
            reflection, your counsel in decision-making, and your inspiration
            for growth. Let your intuition and lived experiences inform your
            choices as you begin this transformative exploration of self and
            world.
          </Typography>
          {selectedPhilosophies.primary ? (
            <Box>
              <Typography mb={"0.25em"} level="h2">
                Primary Philosophy
              </Typography>
              <Typography mb={"1.5em"} level="body-sm">
                Your primary philosophy forms the core of your worldview. It's
                the main lens through which you interpret life and make
                decisions. This philosophy resonates most strongly with your
                values and natural tendencies.
              </Typography>
              <PhilosophyItemBasic
                philosophy={{
                  id: selectedPhilosophies.primary.id,
                  name: selectedPhilosophies.primary.name,
                  explanation: selectedPhilosophies.primary.summary,
                  application: "",
                }}
                variant="primary"
                onRemove={() =>
                  selectedPhilosophies.primary
                    ? removePhilosophy(selectedPhilosophies.primary.id)
                    : null
                }
              />
            </Box>
          ) : null}

          {selectedPhilosophies.complementary.length ? (
            <Box>
              <Typography mb={"0.25em"} level="h2">
                Complementary Philosophies
              </Typography>
              <Typography mb={"1.5em"} level="body-sm">
                These are two additional philosophies that enhance and balance
                your primary philosophy. They provide supplementary perspectives
                and practices, helping you develop a more comprehensive approach
                to life's challenges and opportunities.
              </Typography>
              {selectedPhilosophies.complementary.map((philosophy) => (
                <PhilosophyItemBasic
                  key={philosophy.id}
                  philosophy={{
                    id: philosophy.id,
                    name: philosophy.name,
                    explanation: philosophy.summary,
                    application: "",
                  }}
                  onRemove={() =>
                    philosophy.id ? removePhilosophy(philosophy.id) : null
                  }
                  variant="primary"
                />
              ))}
            </Box>
          ) : null}

          <Button
            onClick={() => {
              const queryString = [
                selectedPhilosophies.primary?.id,
                selectedPhilosophies.complementary[0].id,
                selectedPhilosophies.complementary[1].id,
              ]
                .map((item) => `philosophy=${encodeURIComponent(String(item))}`)
                .join("&");

              navigate(`/signup?${queryString}`);
            }}
            href="/signup"
            variant="solid"
            color="primary"
            size="lg"
            disabled={!isSelectionComplete}
          >
            {philosophiesToSelect === 0
              ? "Continue your Journey"
              : philosophiesToSelect === 3
              ? "Select 3 Philosophies to Continue"
              : `Select ${philosophiesToSelect} more`}
          </Button>
          <Box mb={"1em"} />
        </Grid>
        <Grid md={6}>
          {categorizedPhilosophies.map((categories) => (
            <Box mb="1em" key={categories[0]}>
              <Typography mb="0.5em" level="h3">
                {categories[0]}
              </Typography>
              <Grid container spacing={1}>
                {categories[1].map((philosophy) => (
                  <Grid key={philosophy.id} xs={3}>
                    <PhilosophySmallItem
                      key={philosophy.id}
                      philosophy={philosophy}
                      selected={isSelected(philosophy.id)}
                      onClick={() => {
                        if (isSelected(philosophy.id)) {
                          removePhilosophy(philosophy.id);
                        } else if (canSelectMore()) {
                          selectPhilosophy(philosophy.id);
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

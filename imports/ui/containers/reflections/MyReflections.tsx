import React from "react";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Box, Typography, Grid, Button } from "@mui/joy";
import { ReflectionCollection } from "/imports/api/Reflection";
import { ReflectionCard } from "/imports/ui/components/reflections/ReflectionCard";
import { Loader } from "/imports/ui/components/common/Loader";
import { Reflection } from "/imports/api/Reflection";

export const MyReflections: React.FC = () => {
  const {
    reflections,
    isLoading,
  }: { reflections: Reflection[]; isLoading: boolean } = useTracker(() => {
    const subscription = Meteor.subscribe("userReflections");
    const reflections = ReflectionCollection.find(
      {},
      { sort: { createdAt: -1 } }
    ).fetch();
    return {
      reflections,
      isLoading: !subscription.ready(),
    };
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 70px)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />;
      </Box>
    );
  }

  return (
    <Box>
      <Box>
        <Typography level="h2" mb={3}>
          My Reflections
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {reflections.map((reflection) => (
          <Grid key={reflection._id} xs={12} sm={6} md={4}>
            <ReflectionCard reflection={reflection} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

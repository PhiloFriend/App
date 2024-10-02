import React from "react";
import { useParams } from "react-router-dom";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Box, Typography } from "@mui/joy";
import { ReflectionCollection } from "/imports/api/Reflection";
import { ReflectionResult } from "/imports/ui/components/reflections/ReflectionResult";
import { Loader } from "/imports/ui/components/common/Loader";

export const ReflectionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { reflection, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe("reflection", id || "");
    const reflection = ReflectionCollection.findOne(id || "");
    return {
      reflection,
      isLoading: !subscription.ready(),
    };
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!reflection) {
    return <Typography level="h4">Reflection not found</Typography>;
  }

  return (
    <Box sx={{ padding: "2em" }}>
      <Typography level="h2" mb={3}>
        Reflection Details
      </Typography>
      {reflection.result && <ReflectionResult result={reflection.result} />}
    </Box>
  );
};

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Box, Typography } from "@mui/joy";
import { ReflectionCollection } from "/imports/api/reflection/index";
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

  const resultReady = useMemo(() => {
    if (!reflection || !reflection.result) return false;
    const {
      quote,
      story,
      reflection: reflectionText,
      application,
      sharableCaption,
      image,
    } = reflection.result;
    return !!(
      quote &&
      story &&
      reflectionText &&
      application &&
      sharableCaption &&
      image
    );
  }, [reflection]);

  if (isLoading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </Box>
    );
  }

  if (!reflection) {
    return <Typography level="h4">Reflection not found</Typography>;
  }

  if (!resultReady) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Loader />
          <Typography sx={{ mt: "0.5em" }} level="body-md">
            Processing Your Reflection Result
          </Typography>
          <Typography sx={{ mt: "0.25em" }} level="body-sm">
            {reflection.status}
          </Typography>
        </Box>
      </Box>
    );
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

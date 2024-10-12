import React, { useEffect } from "react";
//@ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Box, Typography, Grid, Button } from "@mui/joy";
import { ReflectionCollection, Reflection } from "/imports/api/reflection/index";
import { ReflectionCard } from "/imports/ui/components/reflections/ReflectionCard";
import { Loader } from "/imports/ui/components/common/Loader";
import { useNavigate } from "react-router-dom";
import { AccountControl } from "/imports/ui/components/AccountControl";

export const MyReflections: React.FC = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    if (!isLoading && reflections.length === 0) {
      navigate("/reflect");
    }
  }, [reflections]);

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
        <Loader />
      </Box>
    );
  }

  return (
    <Box>
      <AccountControl />
      
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

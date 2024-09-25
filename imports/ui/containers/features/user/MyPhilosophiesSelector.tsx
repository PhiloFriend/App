import React from "react";
import { Meteor } from "meteor/meteor";
// @ts-ignore
import { useTracker } from "meteor/react-meteor-data";
import { Box, Grid } from "@mui/joy";
import {
  PhilosophyCollection,
  PhilosophyType,
} from "/imports/api/Philosophies";
import { PhilosophySmallItem } from "/imports/ui/components/features/philosophy/PhilosophySmallItem";

interface MyPhilosophiesSelectorProps {
  onSelect?: (philosophy: PhilosophyType) => void;
  selectedPhilosophy?: PhilosophyType;
}

const MyPhilosophiesSelector: React.FC<MyPhilosophiesSelectorProps> = ({
  onSelect,
  selectedPhilosophy,
}) => {
  const user = useTracker(() => Meteor.user());
  const userPhilosophies = user?.profile?.philosophies || [];

  const philosophies = useTracker(() =>
    PhilosophyCollection.find({ id: { $in: userPhilosophies } }).fetch()
  );

  const [selected, setSelected] = React.useState<PhilosophyType | undefined>(
    selectedPhilosophy || philosophies[0]
  );

  const handleSelect = (philosophy: PhilosophyType) => {
    setSelected(philosophy);
    if (onSelect) {
      onSelect(philosophy);
    }
  };

  return (
    <Box>
      <Grid container spacing={0.25}>
        {philosophies.map((philosophy: any) => (
          <Grid xs={4} key={philosophy.id}>
            <PhilosophySmallItem
              philosophy={philosophy}
              onClick={() => handleSelect(philosophy)}
              selected={selected?.id === philosophy.id}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyPhilosophiesSelector;

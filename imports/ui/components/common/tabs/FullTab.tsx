import React from "react";
import { FullTabType } from "./types";
import { Grid } from "@mui/joy";
import { FullTabItem } from "./FullTabItem";

interface FullTabProps {
  tabs: Array<FullTabType>;
  selectedTab: number;
  setSelectedTab: Function;
}

export const FullTab = ({
  tabs,
  selectedTab,
  setSelectedTab,
}: FullTabProps) => {
  return (
    <Grid container spacing={2}>
      {tabs.map((tab, i) => (
        <Grid
          xs={12 / tabs.length}
          key={tab.title}
          onClick={() => setSelectedTab(i)}
        >
          <FullTabItem tab={tab} selected={i === selectedTab} />
        </Grid>
      ))}
    </Grid>
  );
};

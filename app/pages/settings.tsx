import { Grid } from "@mui/material";
import { NextPage } from "next";
import FlexCard from "../components/elements/FlexCard";
import SettingsView from "../components/templates/SettingsView";

const Metrics: NextPage = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<SettingsView />} />
      </Grid>
    </Grid>
  );
};

export default Metrics;

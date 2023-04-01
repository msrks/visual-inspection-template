import { Grid } from "@mui/material";
import { NextPage } from "next";
import FlexCard from "../components/elements/FlexCard";
import DevView from "../components/templates/DevView";

const Metrics: NextPage = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<DevView />} />
      </Grid>
    </Grid>
  );
};

export default Metrics;

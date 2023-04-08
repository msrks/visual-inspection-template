import { Grid } from "@mui/material";
import { NextPage } from "next";
import FlexCard from "../components/elements/FlexCard";
import NumberOfUnreviewed from "../components/templates/NumberOfUnreviewed";
import NumberOfInspections from "../components/templates/NumberOfInspections";

const Metrics: NextPage = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<NumberOfInspections />} />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<NumberOfUnreviewed />} />
      </Grid>
    </Grid>
  );
};

export default Metrics;

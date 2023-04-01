import { Grid } from "@mui/material";
import { NextPage } from "next";
import FlexCard from "../components/elements/FlexCard";
import RetrainAIView from "../components/templates/RetrainAIView";
import TableModels from "../components/templates/TableModels";

const Metrics: NextPage = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<RetrainAIView />} />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<TableModels />} />
      </Grid>
    </Grid>
  );
};

export default Metrics;

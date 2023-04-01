import { Grid } from "@mui/material";
import { NextPage } from "next";
import FlexCard from "../components/elements/FlexCard";
import TableModels from "../components/templates/TableModels";

const VertexAiDatasets: NextPage = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<TableModels />} />
      </Grid>
    </Grid>
  );
};

export default VertexAiDatasets;

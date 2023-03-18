import { Grid } from "@mui/material";
import { NextPage } from "next";
import FlexCard from "../components/elements/FlexCard";
import ImageListView from "../components/templates/ImageListView";

const lightingCondition = "domeLight";

const DomeLight: NextPage = () => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} md={12} lg={12}>
        <FlexCard content={<ImageListView lightingCondition={lightingCondition} />} />
      </Grid>
    </Grid>
  );
};

export default DomeLight;

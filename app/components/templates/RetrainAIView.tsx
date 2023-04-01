import { FC, useMemo, useState } from "react";
import Title from "../elements/Title";
import {
  Stack,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  capitalize,
  Typography,
  Container,
  Grid,
  TextField,
} from "@mui/material";
import { db, func } from "../../lib/firebase";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { SmartToy } from "@mui/icons-material";
import { addDays, endOfDay, endOfToday, isAfter, isBefore, startOfDay, startOfToday, subDays } from "date-fns";
import { LocalizationProvider, PickersShortcutsItem } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateRange, DateRangePicker, StaticDateRangePicker } from "@mui/x-date-pickers-pro";
import { collection, orderBy, Query, query } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { Image, lightingCondition, Metrics } from "../../types";
import { LoadingButton } from "@mui/lab";

const getShortcutsItems = (minDate: Date): PickersShortcutsItem<DateRange<Date>>[] => [
  { label: "All Time", getValue: () => [minDate, new Date()] },
  { label: "Last 90 Days", getValue: () => [addDays(new Date(), -90), new Date()] },
  { label: "Last 30 Days", getValue: () => [addDays(new Date(), -30), new Date()] },
  { label: "Reset", getValue: () => [null, null] },
];

interface PropsRetrainAI {
  lightingCondition: lightingCondition;
  dateRange: DateRange<Date>;
}

const lightingConditionList = ["original", "converted"];

const RetrainAIView: FC = () => {
  const q = query(collection(db, "metrics"), orderBy("createdAt", "asc")) as Query<Metrics>;
  const [metrics, loadingM, errorM] = useCollectionDataOnce<Metrics>(q);
  const qi = query(collection(db, "images"), orderBy("createdAt", "asc")) as Query<Image>;
  const [images, loadingI, errorI] = useCollectionDataOnce<Image>(qi);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([subDays(startOfToday(), 7), endOfToday()]);
  const { setFeedback } = useSnackbar();
  const [lightingCondition, setLightingCondition] = useState<lightingCondition>("original");
  const [execute, executing, errorExecute] = useHttpsCallable<PropsRetrainAI, string>(func, "retrainAI");
  const handleClick = async () => {
    setFeedback({ message: "Training Job has started!", severity: "success" });
    const res = await execute({ lightingCondition, dateRange });
    setFeedback({ message: res?.data || "Training Job has finished!", severity: "success" });
  };
  const minDate = metrics && metrics.length > 0 ? metrics[0].createdAt.toDate() : new Date();

  const numDogs =
    images
      ?.filter((i) => i.humanLabel === "dog")
      .filter((i) => i.lightingCondition === lightingCondition)
      .filter((i) => isAfter(i.createdAt.toDate(), dateRange[0]!))
      .filter((i) => isBefore(i.createdAt.toDate(), dateRange[1]!)).length || 0;

  const numCats =
    images
      ?.filter((i) => i.humanLabel === "cat")
      .filter((i) => i.lightingCondition === lightingCondition)
      .filter((i) => isAfter(i.createdAt.toDate(), dateRange[0]!))
      .filter((i) => isBefore(i.createdAt.toDate(), dateRange[1]!)).length || 0;
  const numTotal = numDogs! + numCats;

  return (
    <>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Title>Retrain AI</Title>
      </Stack>
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item md={6} xs={12} my="auto">
            <Typography my={2}>Lighting Condition: </Typography>
          </Grid>
          <Grid item md={6} xs={12} my="auto">
            <FormControl>
              <RadioGroup
                row
                name="lc"
                value={lightingCondition}
                onChange={(e) => setLightingCondition(e.target.value as lightingCondition)}
              >
                {lightingConditionList.map((lc) => (
                  <FormControlLabel key={lc} value={lc} control={<Radio />} label={capitalize(lc)} />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item md={6} xs={12} my="auto">
            <Typography my={2}>Date Range:</Typography>
          </Grid>
          <Grid item md={6} xs={12} my="auto">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateRangePicker
                slotProps={{
                  shortcuts: { items: getShortcutsItems(minDate) },
                  actionBar: { actions: [] },
                  textField: { variant: "standard" },
                }}
                calendars={1}
                value={dateRange}
                onChange={(val) => setDateRange([val[0], endOfDay(val[1]!)])}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item md={6} xs={12} my="auto">
            <Typography my={2}>Number of Images:</Typography>
          </Grid>
          <Grid item md={6} xs={12} my="auto">
            <TextField size="small" variant="standard" id="total" label="Total" value={numTotal} disabled sx={{ width: 80, mr: 1 }} />
            <TextField size="small" variant="standard" id="dogs" label="Dog" value={numDogs} disabled sx={{ width: 80, mr: 1 }} />
            <TextField size="small" variant="standard" id="cat" label="Cat" value={numCats} disabled sx={{ width: 80, mr: 1 }} />
          </Grid>
        </Grid>
      </Container>

      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDateRangePicker
          slotProps={{
            shortcuts: { items: getShortcutsItems(minDate) },
            actionBar: { actions: [] },
          }}
          calendars={3}
          value={dateRange}
          onChange={(val) => setDateRange([val[0], endOfDay(val[1]!)])}
        />
      </LocalizationProvider> */}

      <LoadingButton
        loading={executing}
        variant="contained"
        size="small"
        sx={{ color: "white", mx: "auto", mt: 1 }}
        endIcon={<SmartToy />}
        component="span"
        onClick={handleClick}
      >
        Start Training
      </LoadingButton>
    </>
  );
};

export default RetrainAIView;

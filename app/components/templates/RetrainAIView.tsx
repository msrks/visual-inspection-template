import { FC, useState } from "react";
import Title from "../elements/Title";
import { Stack, Button } from "@mui/material";
import { db, func } from "../../lib/firebase";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { SmartToy } from "@mui/icons-material";
import { addDays } from "date-fns";
import { LocalizationProvider, PickersShortcutsItem } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateRange, StaticDateRangePicker } from "@mui/x-date-pickers-pro";
import { collection, orderBy, Query, query } from "firebase/firestore";
import { useCollectionDataOnce } from "react-firebase-hooks/firestore";
import { Metrics } from "../../types";

const getShortcutsItems = (minDate: Date): PickersShortcutsItem<DateRange<Date>>[] => [
  { label: "All Time", getValue: () => [minDate, new Date()] },
  { label: "Last 90 Days", getValue: () => [addDays(new Date(), -90), new Date()] },
  { label: "Last 30 Days", getValue: () => [addDays(new Date(), -30), new Date()] },
  { label: "Reset", getValue: () => [null, null] },
];

const RetrainAIView: FC = () => {
  const q = query(collection(db, "metrics"), orderBy("createdAt", "asc")) as Query<Metrics>;
  const [metrics, loading, error] = useCollectionDataOnce<Metrics>(q);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([new Date(), new Date()]);
  const { setFeedback } = useSnackbar();
  const [execute, executing, errorExecute] = useHttpsCallable<DateRange<Date>, string>(func, "retrainAI");
  const handleClick = async () => {
    setFeedback({ message: "Training Job has started!", severity: "success" });
    const res = await execute(dateRange);
    setFeedback({ message: res?.data || "Training Job has finished!", severity: "success" });
  };
  const minDate = metrics && metrics.length > 0 ? metrics[0].createdAt.toDate() : new Date();
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Title>Retrain AI</Title>
      </Stack>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDateRangePicker
          slotProps={{
            shortcuts: { items: getShortcutsItems(minDate) },
            actionBar: { actions: [] },
          }}
          calendars={3}
          value={dateRange}
          onChange={(val) => setDateRange(val)}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        size="small"
        sx={{ color: "white", mx: "auto", mt: 2 }}
        endIcon={<SmartToy />}
        component="span"
        onClick={handleClick}
      >
        Start Training
      </Button>
    </>
  );
};

export default RetrainAIView;

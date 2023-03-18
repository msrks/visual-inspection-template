import { FC } from "react";
import Title from "../elements/Title";
import { Stack } from "@mui/material";
import ChartBar from "../elements/ChartBar";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, orderBy, Query, query } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Metrics } from "../../types";

const NumberOfInspections: FC = () => {
  const q = query(collection(db, "metrics"), orderBy("createdAt", "asc")) as Query<Metrics>;
  const [metrics, loading, error] = useCollectionData<Metrics>(q);

  const dataset =
    metrics?.map((m) => ({
      value: m.num,
      date: m.date,
    })) || [];

  console.log(dataset);

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Title>Number Of Inspections</Title>
      </Stack>
      {dataset.length > 0 && (
        <Stack height={200}>
          <ChartBar ylabel="Counts" dataset={dataset} />
        </Stack>
      )}
    </>
  );
};

export default NumberOfInspections;

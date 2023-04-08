import { FC } from "react";
import Title from "../elements/Title";
import { Stack } from "@mui/material";
import ChartBar from "../elements/ChartBar";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { collection, doc, orderBy, Query, query, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Metrics } from "../../types";

// const fixMetricsDocs = async (date: string) => {
//   await updateDoc(doc(db, `metrics/${date}`), {
//     numUnreviewed: 0,
//   });
// };

const NumberOfUnreviewed: FC = () => {
  const q = query(collection(db, "metrics"), orderBy("createdAt", "asc")) as Query<Metrics>;
  const [metrics, loading, error] = useCollectionData<Metrics>(q);

  const dataset =
    metrics?.map((m) => ({
      value: m.numUnreviewed,
      date: m.date,
    })) || [];

  console.log(dataset);

  // metrics?.forEach((m) => fixMetricsDocs(m.date));

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Title>Unreviewed Images</Title>
      </Stack>
      {dataset.length > 0 && (
        <Stack height={200}>
          <ChartBar ylabel="Counts" dataset={dataset} />
        </Stack>
      )}
    </>
  );
};

export default NumberOfUnreviewed;

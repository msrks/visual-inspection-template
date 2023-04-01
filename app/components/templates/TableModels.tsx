import { FC } from "react";
import Title from "../elements/Title";
import { CircularProgress, Container, Stack, Typography } from "@mui/material";
import { collection, deleteDoc, doc, orderBy, Query, query, QuerySnapshot } from "firebase/firestore";
import { Model } from "../../types";
import { db } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { DataGridPro, GridActionsCellItem, GridColDef, GridCsvExportOptions, GridToolbar } from "@mui/x-data-grid-pro";
import { format } from "date-fns";
import Link from "../elements/Link";
import { Delete } from "@mui/icons-material";

const TableModel: FC = () => {
  const q = query(collection(db, "models"), orderBy("createdAt", "desc")) as Query<Model>;
  const [snap, loading, error] = useCollection<Model>(q);

  return (
    <>
      {error && <Typography m="auto">⛔️ {error.message}</Typography>}
      {loading && <CircularProgress sx={{ m: "auto" }} />}
      {snap && snap.docs.length == 0 && <Typography m="auto">⛔️ There is no model</Typography>}
      {snap && snap.docs.length > 0 && <TableModelMain snap={snap} />}
    </>
  );
};

interface Props {
  snap: QuerySnapshot<Model>;
}

const columns = (
  [
    {
      field: "datasetId",
      headerName: "id",
    },
    {
      field: "auPrc",
      headerName: "mAP",
      valueFormatter: (val) => val.value && (val.value * 100).toFixed(2) + "%",
    },
    {
      field: "state",
      headerName: "trainingPipeline",
      minWidth: 110,
      valueGetter: (val) => val.value?.replace("PIPELINE_STATE_", "").toLowerCase(),
    },
    {
      field: "lightingCondition",
      headerName: "lighting",
      minWidth: 70,
    },
    {
      field: "numImages",
      headerName: "numTotal",
      valueFormatter: (val) => val.value + "枚",
      minWidth: 80,
    },
    {
      field: "numDogs",
      valueFormatter: (val) => val.value + "枚",
      minWidth: 80,
    },
    {
      field: "numCats",
      valueFormatter: (val) => val.value + "枚",
      minWidth: 80,
    },
    // { field: "gcsSourceUri", headerName: "importFile" },

    // { field: "updatedAt" },
    {
      field: "dateRange",
      valueFormatter: (val) =>
        val.value && `${format(new Date(val.value[0]) as Date, "yy/MM/dd")} ~ ${format(new Date(val.value[1]) as Date, "yy/MM/dd")}`,
      minWidth: 160,
    },
    {
      field: "createdAt",
      valueGetter: (val) => val.value?.toDate(),
      valueFormatter: (val) => val.value && format(val.value as Date, "yy/MM/dd HH:mm"),
      minWidth: 120,
    },
    {
      field: "actions",
      type: "actions",
      minWidth: 20,
      getActions: (p) => [
        <GridActionsCellItem icon={<Delete />} label="Delete" key="dl" onClick={() => deleteDoc(doc(db, `models/${p.id}`))} />,
      ],
    },
  ] as GridColDef[]
).map((col) => ({ flex: 1, align: "center", headerAlign: "center", ...col }));

const DetailPanel: FC<{ row: Model }> = ({ row }) => {
  return (
    <Container sx={{ my: 1 }}>
      <Typography fontSize={14}>
        - ImportFile : ⬇️
        <Link href={row.gcsSourceUri.replace("gs://", "https://storage.cloud.google.com/")}>{row.gcsSourceUri} </Link>
      </Typography>
      {row.state !== "prepairing" && (
        <Typography fontSize={14}>
          - datasetId : 🔗
          <Link
            href={`https://console.cloud.google.com/vertex-ai/locations/us-central1/datasets/${row.datasetId}/browse?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
            target="_blank"
          >
            {row.datasetId}
          </Link>
        </Typography>
      )}
      {row.modelId && (
        <Typography fontSize={14}>
          - modelId : 🔗
          <Link
            href={`https://console.cloud.google.com/vertex-ai/locations/us-central1/models/${row.modelId}/versions/1/evaluations/${row.evalId}?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`}
            target="_blank"
          >
            {row.modelId}
          </Link>
        </Typography>
      )}
      {row.urlSavedModel && (
        <Typography fontSize={14}>
          - tfSavedModel : ⬇️
          <Link href={row.urlSavedModel.replace("gs://", "https://storage.cloud.google.com/") + "/saved_model.pb"}>
            {row.urlSavedModel}{" "}
          </Link>
        </Typography>
      )}
      {row.urlTflite && (
        <Typography fontSize={14}>
          - tfite : ⬇️
          <Link href={row.urlTflite.replace("gs://", "https://storage.cloud.google.com/") + "/model.tflite"}>{row.urlTflite} </Link>
        </Typography>
      )}
    </Container>
  );
};

const TableModelMain: FC<Props> = ({ snap }) => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Title>AI Models</Title>
      </Stack>
      <DataGridPro
        autoHeight
        disableColumnMenu
        rows={snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }))}
        initialState={{
          sorting: {
            sortModel: [{ field: "createdAt", sort: "desc" }],
          },
        }}
        rowHeight={42}
        columns={columns as GridColDef[]}
        columnHeaderHeight={42}
        disableColumnSelector
        getDetailPanelContent={({ row }) => <DetailPanel row={row} />}
        getDetailPanelHeight={() => "auto"}
      />
    </>
  );
};

export default TableModel;

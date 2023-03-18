import Typography from "@mui/material/Typography";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  TextField,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { ChangeEvent, FC, useState } from "react";
import { collection, deleteDoc, DocumentReference, orderBy, Query, query, QuerySnapshot, updateDoc, where } from "firebase/firestore";
import { Image } from "../../types/image";
import { useCollection } from "react-firebase-hooks/firestore";
import Title from "../../components/elements/Title";
import { Cancel, CheckCircle, Delete, Refresh } from "@mui/icons-material";
import { db } from "../../lib/firebase";
import { red, cyan } from "@mui/material/colors";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";

const colorDict = (bool: boolean) => (bool ? cyan[600] : red[600]);

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

interface Props {
  lightingCondition: "domeLight" | "barLight";
}

const ImageListView: FC<Props> = ({ lightingCondition }) => {
  const q = query(
    collection(db, "images"),
    where("lightingCondition", "==", lightingCondition),
    orderBy("createdAt", "desc")
  ) as Query<Image>;
  const [snap, loading, error] = useCollection<Image>(q);

  return (
    <>
      {error && <Typography m="auto">⛔️ {error.message}</Typography>}
      {loading && <CircularProgress sx={{ m: "auto" }} />}
      {snap && snap.docs.length == 0 && <Typography m="auto">⛔️ There is no images</Typography>}
      {snap && snap.docs.length > 0 && <ImageListViewMain title={capitalize(lightingCondition)} snap={snap} />}
    </>
  );
};

interface PropsMain {
  title: string;
  snap: QuerySnapshot<Image>;
}

type OperationMode = "pre" | "pro";
const operationModeList: OperationMode[] = ["pre", "pro"];
const operationModeLabelDict = {
  pre: "プレ運用",
  pro: "本番運用",
  test: "テスト運用",
};

const ImageListViewMain: FC<PropsMain> = ({ title, snap }) => {
  const images = snap.docs.map((doc) => ({
    ...doc.data(),
    ref: doc.ref,
    operationMode: doc.data().predLabel ? "pro" : "pre",
  }));
  const dateList = images.map((img) => img.createdAt.toDate());
  const minDate = dateList.reduce((a, b) => (a < b ? a : b));
  const maxDate = dateList.reduce((a, b) => (a > b ? a : b));
  const [filters, setFilters] = useState<OperationMode[]>(operationModeList);
  const [dateRange, setDateRange] = useState<DateRange<Date>>([minDate, maxDate]);
  const sm = useMediaQuery((theme: Theme) => theme.breakpoints.down("lg"));

  const filterdImages = images
    .filter((img) => dateRange[0] === null || dateRange[0] <= img.createdAt.toDate())
    .filter((img) => dateRange[1] === null || dateRange[1] >= img.createdAt.toDate())
    .filter((img) => filters.includes(img.operationMode as OperationMode));

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.checked ? setFilters([...filters, e.target.id as OperationMode]) : setFilters(filters.filter((key) => key !== e.target.id));

  const updateReview = (ref: DocumentReference<Image>, img: Image) => {
    updateDoc(ref, { humanLabel: img.humanLabel === "ok" ? "ng" : img.humanLabel === "ng" ? "ok" : img.predLabel });
  };

  // const refreshDateRange = () => setDateRange([minDate, maxDate]);

  return (
    <>
      <Stack mb={1} direction="row" alignItems="center">
        <Title>{title}</Title>
        <FormGroup row sx={{ ml: "auto", mr: "20px" }}>
          {operationModeList.map((key) => (
            <FormControlLabel
              key={key}
              control={<Checkbox id={key} checked={filters.includes(key)} onChange={updateFilter} />}
              label={operationModeLabelDict[key]}
            />
          ))}
        </FormGroup>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            calendars={1}
            value={dateRange}
            onChange={(val) => setDateRange(val)}
            slots={{
              textField: (props) => <TextField {...props} size="small" variant="standard" sx={{ width: "120px" }} />,
            }}
          />
        </LocalizationProvider>
      </Stack>

      {filterdImages.length === 0 && <Typography m="auto">⛔️ There is no images</Typography>}
      {filterdImages.length > 0 && (
        <ImageList
          sx={{ width: !sm ? 1000 : 300, height: 580, marginX: "auto", my: 0 }}
          rowHeight={!sm ? 120 : 130}
          cols={!sm ? 5 : 2}
          gap={6}
        >
          {filterdImages.map((img, i) => (
            <div key={i}>
              <ImageListItem sx={{ overflow: "hidden" }}>
                <img key="2" src={img.imagePath.replace("gs://", "https://storage.googleapis.com/")} alt="img" loading="lazy" />
                {img.operationMode === "pre" && (
                  <ImageListItemBar
                    sx={{
                      background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                    }}
                    subtitle={"プレ運用"}
                    position="top"
                    actionIcon={
                      <IconButton size="small" sx={{ color: "white" }} onClick={() => deleteDoc(img.ref)}>
                        <Delete sx={{ fontSize: "18px" }} />
                      </IconButton>
                    }
                  />
                )}
                <ImageListItemBar
                  sx={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={img.predLabel ? img.predLabel.toUpperCase() + ": " + img.predConfidence : img.humanLabel.toUpperCase()}
                  subtitle={img.createdAt.toDate().toLocaleString()}
                  actionIcon={
                    img.operationMode === "pro" ? (
                      <IconButton
                        sx={{
                          color: img.humanLabel ? colorDict(img.predLabel === img.humanLabel) : "rgba(255, 255, 255, 0.54)",
                        }}
                        onClick={() => updateReview(img.ref, img)}
                      >
                        {img.predLabel === img.humanLabel ? <CheckCircle /> : <Cancel />}
                      </IconButton>
                    ) : (
                      <></>
                    )
                  }
                />
              </ImageListItem>
            </div>
          ))}
        </ImageList>
      )}
    </>
  );
};

export default ImageListView;

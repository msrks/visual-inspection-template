import Typography from "@mui/material/Typography";
import {
  Box,
  capitalize,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  ImageListItem,
  ImageListItemBar,
  Stack,
  TextField,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import {
  collection,
  deleteDoc,
  DocumentReference,
  limit,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { Image, lightingCondition } from "../../types/image";
import { useCollection } from "react-firebase-hooks/firestore";
import Title from "../../components/elements/Title";
import { Cancel, CheckCircle, Delete } from "@mui/icons-material";
import { db } from "../../lib/firebase";
import { red, cyan } from "@mui/material/colors";
import { AdapterDateFns } from "@mui/x-date-pickers-pro/AdapterDateFns";
import { DateRange, DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { endOfDay } from "date-fns";
import { Masonry } from "@mui/lab";
// import { InView, useInView } from "react-intersection-observer";

const colorDict = (bool: boolean) => (bool ? cyan[600] : red[600]);

interface Props {
  lightingCondition: lightingCondition;
}

const ImageListView: FC<Props> = ({ lightingCondition }) => {
  const [page, setPage] = useState(1);
  const q = query(
    collection(db, "images"),
    where("lightingCondition", "==", lightingCondition),
    orderBy("createdAt", "desc"),
    limit(100)
  ) as Query<Image>;
  const [snap, loading, error] = useCollection<Image>(q);
  return (
    <>
      {error && <Typography m="auto">⛔️ {error.message}</Typography>}
      {loading && <CircularProgress sx={{ m: "auto" }} />}
      {snap && snap.docs.length == 0 && <Typography m="auto">⛔️ There is no images</Typography>}

      {snap && snap.docs.length > 0 && (
        // <InfiniteScroll loadMore={() => setPage((p) => p + 1)} hasMore={true} loader={<>loading</>}>
        <ImageListViewMain title={capitalize(lightingCondition)} snap={snap} setPage={setPage} />
        // </InfiniteScroll>
      )}
    </>
  );
};

interface PropsMain {
  title: string;
  snap: QuerySnapshot<Image>;
  setPage: Dispatch<SetStateAction<number>>;
}

type OperationMode = "pre" | "pro";
const operationModeList: OperationMode[] = ["pre", "pro"];
const operationModeLabelDict = {
  pre: "プレ運用",
  pro: "本番運用",
};

const labelList = ["dog", "cat"];

const ImageListViewMain: FC<PropsMain> = ({ title, snap, setPage }) => {
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
    .filter((img) => dateRange[1] === null || endOfDay(dateRange[1]) >= img.createdAt.toDate())
    .filter((img) => filters.includes(img.operationMode as OperationMode));

  const updateFilter = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.checked
      ? setFilters([...filters, e.target.id as OperationMode])
      : setFilters(filters.filter((key) => key !== e.target.id));

  const updateReview = async (ref: DocumentReference<Image>, img: Image) => {
    let humanLabel;
    if (!img.humanLabel) {
      humanLabel = img.predLabel;
    } else {
      const index = labelList.indexOf(img.humanLabel);
      humanLabel = labelList[(index + 1) % labelList.length];
    }

    await updateDoc(ref, { humanLabel });
  };

  // const refreshDateRange = () => setDateRange([minDate, maxDate]);

  return (
    <div>
      <Stack mb={1} direction="row" alignItems="center" justifyContent="space-between">
        <Title>{title}</Title>
        {!sm && (
          <FormGroup row sx={{ ml: "auto", mr: "20px" }}>
            {operationModeList.map((key) => (
              <FormControlLabel
                key={key}
                control={<Checkbox id={key} checked={filters.includes(key)} onChange={updateFilter} />}
                label={operationModeLabelDict[key]}
              />
            ))}
          </FormGroup>
        )}
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
        <>
          <Box mr={4}>
            <Masonry columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 5 }} spacing={{ xs: 1 }}>
              {/* <ImageList sx={{ width: !sm ? 1000 : 400, height: 580, marginX: "auto", my: 0 }} rowHeight={200} cols={!sm ? 5 : 2} gap={6}> */}
              {filterdImages.map((img, i) => (
                <div key={i}>
                  <ImageListItem sx={{ overflow: "hidden", maxHeight: "120px", minHeight: "80px" }}>
                    <img key="2" src={`https://storage.googleapis.com/${img.bucket}/${img.dstPath}`} alt="img" loading="lazy" />
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
                      title={
                        img.predLabel
                          ? img.predLabel.toUpperCase() + ": " + img.predConfidence.toFixed(2)
                          : img.humanLabel.toUpperCase()
                      }
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
              {/* </ImageList> */}
            </Masonry>
          </Box>
          {/* <InView onChange={(inView, entry) => inView && setPage((p) => p + 1)} /> */}
        </>
      )}
    </div>
  );
};

export default ImageListView;

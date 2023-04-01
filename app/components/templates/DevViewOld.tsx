import { ChangeEvent, FC, useState } from "react";
import Title from "../elements/Title";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from "@mui/material";
import UploadButton from "../modules/UploadButton";

type ImageType = "barLight" | "domeLight";
const imageTypeList: ImageType[] = ["barLight", "domeLight"];

type LabelType = "ok" | "ng";
const labelTypeList: LabelType[] = ["ok", "ng"];

const DevView: FC = () => {
  const [imageType, setImageType] = useState<ImageType>("barLight");
  const [labelType, setLabelType] = useState<LabelType>("ok");
  const [url, setUrl] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageType((e.target as HTMLInputElement).value as ImageType);
  };
  const handleChangeLabel = (e: ChangeEvent<HTMLInputElement>) => {
    setLabelType((e.target as HTMLInputElement).value as LabelType);
  };
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Title>Dev.</Title>
        <Box mx="auto" />
        <FormControl>
          <RadioGroup row name="radio-group" value={imageType} onChange={handleChange}>
            {imageTypeList.map((it) => (
              <FormControlLabel key={it} value={it} control={<Radio />} label={it} />
            ))}
          </RadioGroup>
        </FormControl>
        <UploadButton imageType={imageType} setUrl={setUrl} />
      </Stack>
      {url && (
        <Stack direction="row" alignItems="center" justifyContent="center">
          <img src={url} width={200} />
          <FormControl sx={{ ml: 2 }}>
            <RadioGroup name="radio-group-label" value={labelType} onChange={handleChangeLabel}>
              {labelTypeList.map((t) => (
                <FormControlLabel key={t} value={t} control={<Radio />} label={t} />
              ))}
            </RadioGroup>
          </FormControl>
        </Stack>
      )}
    </>
  );
};

export default DevView;

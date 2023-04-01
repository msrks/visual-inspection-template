import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { ImageView } from "./ImageView";
import { ImageCaptures, Image, Label } from "../types";

const baseUrl = "http://127.0.0.1:8000";
const sampleImage1 = {
  imagePath: `${baseUrl}/static/domeLight.png`,
  lightingCondition: "domeLight",
  imageId: "placeholder1",
};
const sampleImage2 = {
  imagePath: `${baseUrl}/static/barLight.png`,
  lightingCondition: "barLight",
  imageId: "placeholder2",
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [img1, setImg1] = useState<Image>(sampleImage1);
  const [img2, setImg2] = useState<Image>(sampleImage2);
  const [label1, setLabel1] = useState<Label>("ok");
  const [label2, setLabel2] = useState<Label>("ok");

  const captureImage = async () => {
    setLoading(true);
    const res = await fetch(`${baseUrl}/image_capture`);
    const { images } = (await res.json()) as ImageCaptures;
    setLoading(false);
    setImg1(images[0]);
    setImg2(images[1]);
  };

  const registerLabel = async () => {
    await fetch(`${baseUrl}/register_label`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        labels: [
          {
            imageId: img1.imageId,
            lightingCondition: img1.lightingCondition,
            label: label1,
          },
          {
            imageId: img2.imageId,
            lightingCondition: img2.lightingCondition,
            label: label2,
          },
        ],
      }),
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h4" component="h1">
            Edge UI : Labeling Mode
          </Typography>
        </Stack>
        <img src={`${baseUrl}/video_feed`} width="500" />
        <Stack direction="row" mx="auto" mb={1} justifyContent="center">
          <LoadingButton
            loading={loading}
            onClick={captureImage}
            variant="contained"
          >
            Capture Image
          </LoadingButton>
        </Stack>
        <Stack direction="row" justifyContent="space-around" my={1}>
          <ImageView
            title="ドーム照明"
            isLoading={loading}
            imageURL={img1.imagePath}
          />
          <ImageView
            title="バー照明"
            isLoading={loading}
            imageURL={img2.imagePath}
          />
        </Stack>
        <Stack direction="row" justifyContent="space-around" my={1}>
          <FormControl>
            <RadioGroup
              aria-labelledby="labeling1"
              name="labeling1"
              value={label1}
              onChange={(e) => setLabel1(e.target.value as "ok")}
              row
            >
              <FormControlLabel value="ok" control={<Radio />} label="OK" />
              <FormControlLabel value="ng" control={<Radio />} label="NG" />
              <FormControlLabel
                value="invalid"
                control={<Radio />}
                label="Invalid"
              />
            </RadioGroup>
          </FormControl>
          <FormControl>
            <RadioGroup
              aria-labelledby="labeling1"
              name="labeling1"
              value={label2}
              onChange={(e) => setLabel2(e.target.value as "ok")}
              row
            >
              <FormControlLabel value="ok" control={<Radio />} label="OK" />
              <FormControlLabel value="ng" control={<Radio />} label="NG" />
              <FormControlLabel
                value="invalid"
                control={<Radio />}
                label="Invalid"
              />
            </RadioGroup>
          </FormControl>
        </Stack>
        <Stack direction="row" mx="auto" my={1} justifyContent="center">
          <LoadingButton
            loading={false}
            onClick={registerLabel}
            variant="contained"
          >
            Register Label
          </LoadingButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" align="center">
          Copyright © Masahiro Rikiso {new Date().getFullYear()}.
        </Typography>
      </Box>
    </Container>
  );
}

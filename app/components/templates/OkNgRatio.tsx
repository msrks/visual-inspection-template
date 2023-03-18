import { useMemo, FC } from "react";
import Title from "../elements/Title";
import { Stack, CircularProgress, Typography } from "@mui/material";

const OkNgRatio: FC = () => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Title>OK/NG Ratio</Title>
      </Stack>
      <ul>
        <li>グラフ</li>
      </ul>
    </>
  );
};

export default OkNgRatio;

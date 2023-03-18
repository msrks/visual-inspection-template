import { FC } from "react";
import Title from "../elements/Title";
import { Stack } from "@mui/material";

const SettingsView: FC = () => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <Title>Settings</Title>
      </Stack>
      <ul>
        <li>？</li>
      </ul>
    </>
  );
};

export default SettingsView;

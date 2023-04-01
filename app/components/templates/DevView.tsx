import { FC } from "react";
import Title from "../elements/Title";
import { Box, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PlayCircleFilled } from "@mui/icons-material";
import { useHttpsCallable } from "react-firebase-hooks/functions";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { func } from "../../lib/firebase";

const DevView: FC = () => {
  const { setFeedback } = useSnackbar();
  const [execute, executing, errorExecute] = useHttpsCallable<number, null>(func, "fetchmultipleimages");
  const handleClick = async () => {
    setFeedback({ message: "Animal Generation has Started!", severity: "success" });
    // const res = await execute(80);
    await Promise.all([...Array(100)].map(async () => await execute(1)));
    setFeedback({ message: "Animal Generation has Finished!", severity: "success" });
    // setFeedback({ message: res?.data || "Animal Generation has Finished!", severity: "success" });
  };
  return (
    <>
      <Stack direction="row" alignItems="center">
        <Title>Generate 100 Animals</Title>
        <Box mx="auto" />
        <LoadingButton
          loading={executing}
          variant="contained"
          size="small"
          endIcon={<PlayCircleFilled />}
          component="span"
          sx={{ color: "white" }}
          onClick={handleClick}
        >
          Run
        </LoadingButton>
      </Stack>
      <Box
        component="img"
        src="https://4.bp.blogspot.com/-pi2OEw0-Eew/XJB5M76Zf9I/AAAAAAABR9I/5FrJ3BqUJtUKKUVvvIJnxQ54v6O97HL0ACLcBGAs/s800/science_hakase_shippai.png"
        alt=""
        width={200}
        mx="auto"
      />
    </>
  );
};

export default DevView;

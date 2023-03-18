import { Close } from "@mui/icons-material";
import { Alert, IconButton, Slide, Snackbar } from "@mui/material";
import { ReactNode, FC } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";

const SnackbarFeedback: FC = () => {
  const { open, setOpen, feedback } = useSnackbar();
  const handleClose = () => setOpen(false);

  const Action: ReactNode = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={feedback.message}
        action={Action}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: 1e5 }}
        TransitionComponent={Slide}
      >
        <Alert variant="filled" onClose={handleClose} severity={feedback.severity} sx={{ width: "100%" }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackbarFeedback;

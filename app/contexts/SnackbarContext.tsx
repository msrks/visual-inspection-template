import { AlertColor } from "@mui/material";
import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

interface Feedback {
  message: string;
  severity: AlertColor;
}

interface SnackbarContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  feedback: Feedback;
  setFeedback: Dispatch<SetStateAction<Feedback>>;
}

const initFeedback: Feedback = { message: "", severity: "success" };

const SnackbarContext = createContext<SnackbarContextProps>({
  open: false,
  setOpen: () => {},
  feedback: initFeedback,
  setFeedback: () => {},
});

export const useSnackbar = (): SnackbarContextProps => useContext(SnackbarContext);

export const SnackbarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(initFeedback);

  useEffect(() => {
    if (feedback.message) setOpen(true);
  }, [feedback]);

  return (
    <SnackbarContext.Provider
      value={{
        open,
        setOpen,
        feedback,
        setFeedback,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

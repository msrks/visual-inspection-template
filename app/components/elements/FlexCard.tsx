import { Paper } from "@mui/material";
import { ReactNode, FC } from "react";

interface Props {
  h?: number;
  content: ReactNode;
}

export const FlexCard: FC<Props> = ({ h, content }) => {
  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: h,
        justifyContent: "space-between",
      }}
    >
      {content}
    </Paper>
  );
};

export default FlexCard;

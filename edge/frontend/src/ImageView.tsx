import { Skeleton, Stack, Typography } from "@mui/material";
import { FC } from "react";

interface Props {
  isLoading: boolean;
  imageURL?: string;
  title: string;
}

export const ImageView: FC<Props> = ({ title, isLoading, imageURL }) => {
  return (
    <Stack alignItems="center">
      <Typography>{title}</Typography>
      {isLoading && <Skeleton variant="rounded" width={200} height={200} />}
      {!isLoading && imageURL && <img src={imageURL} width="200" />}
    </Stack>
  );
};

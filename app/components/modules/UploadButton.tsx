import { AddAPhoto } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Typography } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import { useUploadFile } from "react-firebase-hooks/storage";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { storage } from "../../lib/firebase";

interface Props {
  imageType: string;
  setUrl: Dispatch<SetStateAction<string>>;
}

const UploadButton: FC<Props> = ({ imageType, setUrl }) => {
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const { setFeedback } = useSnackbar();

  const id = `upload-${imageType}`;

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const f = e.target.files ? e.target.files[0] : undefined;
      if (f) {
        const result = await uploadFile(ref(storage, `${imageType}/${Date.now()}_${f.name}`), f, { contentType: f.type });
        const url = await getDownloadURL(result!.ref);
        setUrl(url);
        setFeedback({ message: `picture for "${imageType}" is uploaded!`, severity: "success" });
      }
    } catch (e: any) {
      setFeedback({ message: e.message, severity: "error" });
    }
  };

  return (
    <>
      {error && <Typography>⛔️ {error.message}</Typography>}
      <label htmlFor={id}>
        <input style={{ display: "none" }} accept="image/*" id={id} type="file" onChange={upload} data-testid={id} />
        <LoadingButton
          loading={uploading}
          variant="contained"
          size="small"
          endIcon={<AddAPhoto />}
          component="span"
          sx={{ color: "white" }}
        >
          upload
        </LoadingButton>
      </label>
    </>
  );
};

export default UploadButton;

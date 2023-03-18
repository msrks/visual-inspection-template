import { Link, Typography } from "@mui/material";

const Copyright = (props: any) => {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href={process.env.NEXT_PUBLIC_AUTHOR_URL}>
        {process.env.NEXT_PUBLIC_AUTHOR}
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
};

export default Copyright;

import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ReactNode, FC } from "react";
import Link from "../../src/Link";

interface Props {
  href: string;
  text: string;
  ico: ReactNode;
}

const LinkItem: FC<Props> = ({ href, text, ico }) => {
  return (
    <Link href={href}>
      <ListItemButton>
        <ListItemIcon>{ico}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </Link>
  );
};
export default LinkItem;

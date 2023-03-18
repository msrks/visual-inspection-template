import { styled } from "@mui/material/styles";
import { List, Toolbar, Drawer as MuiDrawer, ListSubheader } from "@mui/material";
import { ReactNode, FC } from "react";
import { LinkItems1 } from "./LinkItems";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: 240,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    [theme.breakpoints.down("sm")]: {
      position: "fixed",
    },
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: 0.1 || theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.down("sm")]: {
        width: theme.spacing(0),
      },
    }),
  },
}));

interface Props {
  title?: string;
  comp: ReactNode;
}

const ListDiv: FC<Props> = ({ title, comp }) => {
  return (
    <List
      component="nav"
      subheader={
        title ? (
          <ListSubheader component="div" sx={{ pl: 1.2, py: -2, mb: -2 }} disableGutters>
            {title}
          </ListSubheader>
        ) : undefined
      }
    >
      {comp}
    </List>
  );
};

const DrawerUI: FC<{ open: boolean }> = ({ open }) => {
  return (
    <Drawer variant="permanent" open={open} sx={{ zIndex: 1099 }}>
      <Toolbar variant="dense" />
      <ListDiv comp={<LinkItems1 />} />
    </Drawer>
  );
};

export default DrawerUI;

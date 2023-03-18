import { AppBar, Backdrop, Box, Container, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactNode, useState } from "react";
import Copyright from "./Copyright";
import { Menu as MenuIcon } from "@mui/icons-material";
import DrawerUI from "./DrawerUI";
import SnackbarFeedback from "./SnackbarFeedback";

interface Props {
  title: string;
  children: ReactNode;
}

const Layout: FC<Props> = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="absolute">
        <Toolbar variant="dense" sx={{ pr: "24px", color: "white" }}>
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography component="h1" color="inherit" variant="h6" noWrap ml="10px" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {/* {user && (
            <IconButton color="inherit" onClick={() => {}}>
              <Badge badgeContent={3} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
          )} */}
        </Toolbar>
      </AppBar>
      <DrawerUI open={open} />
      {sm && <Backdrop open={open} onClick={toggleDrawer} />}
      <Box
        component="main"
        sx={{
          bgcolor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar variant="dense" />
        <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
          {children}
          <SnackbarFeedback />
          <Copyright sx={{ pt: 2 }} />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

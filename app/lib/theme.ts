import { createTheme } from "@mui/material/styles";
import { cyan, orange, red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: cyan[600],
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
    success: {
      main: cyan[600],
    },
  },
});

export default theme;

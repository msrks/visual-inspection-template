import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { cyan, red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

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
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;

import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../lib/theme";
import createEmotionCache from "../lib/createEmotionCache";
import { SnackbarProvider } from "../contexts/SnackbarContext";
import Layout from "../components/layouts/Layout";
import { LicenseInfo } from "@mui/x-license-pro";
LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_KEY!);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider>
          <Layout title={process.env.NEXT_PUBLIC_TITLE!}>
            <Component {...pageProps} />
          </Layout>
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

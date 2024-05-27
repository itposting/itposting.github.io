// import "@/styles/globals.css";
import "@/styles/night-owl.css";
import "@/scss/global.scss";

import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" data-gatsby-head="true" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

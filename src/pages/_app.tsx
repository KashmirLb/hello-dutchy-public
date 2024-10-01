import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { LanguageProvider } from "~/context/LanguageProvider";
import { DataProvider } from "~/context/DataProvider";
import { CartProvider } from "~/context/CartProvider";

const MyApp= ({ Component, pageProps }: AppProps) => {
  return (
  <LanguageProvider>
    <DataProvider>
      <CartProvider>
        <Head>
          <title>Hello Dutchy</title>
          <meta name="description" content="Hello Dutchy Website" />
          <link rel="icon" href="/head.png" sizes="any" />
        </Head>
        <Component {...pageProps} />
      </CartProvider>
    </DataProvider>
  </LanguageProvider>)
};

export default api.withTRPC(MyApp);

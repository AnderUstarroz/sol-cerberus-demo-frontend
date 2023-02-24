import { ContextProvider } from "../components/provider";
import Layout from "../components/layout";
import type { AppProps } from "next/app";
import "@solana/wallet-adapter-react-ui/styles.css";
import "../styles/variables.scss";
import "../styles/globals.scss";

function CubistGames({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
}

export default CubistGames;

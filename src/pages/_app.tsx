import { type AppType } from "next/app";
import { trpc } from "@utils/trpc";
import { Outfit } from "@next/font/google";
import "@styles/globals.css";

import Layout from "@components/Layout";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Layout font={outfit}>
      <Component {...pageProps} />
    </Layout>
  );
};

export default trpc.withTRPC(MyApp);

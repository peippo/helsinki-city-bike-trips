import Head from "next/head";

import Map from "@components/Map";
import MainNav from "./MainNav";
import classNames from "classnames";
import { NextFont } from "@next/font/dist/types";

type Props = {
  children: React.ReactNode;
  font: NextFont;
};

const Layout: React.FC<Props> = ({ children, font }) => {
  return (
    <>
      <Head>
        <title>Stations</title>
        <meta name="description" content="Helsinki City Bike Stations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={classNames(
          "flex h-screen min-h-screen items-center justify-center",
          font.className
        )}
      >
        <MainNav />
        {children}
        <Map />
      </main>
    </>
  );
};

export default Layout;

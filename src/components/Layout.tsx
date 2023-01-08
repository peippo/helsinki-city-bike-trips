import Head from "next/head";

import Map from "@components/Map";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Head>
        <title>Stations</title>
        <meta name="description" content="Helsinki City Bike Stations" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen min-h-screen items-center justify-center">
        {children}
        <Map />
      </main>
    </>
  );
};

export default Layout;

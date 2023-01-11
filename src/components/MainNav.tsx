import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  path: string;
  pathMatches?: string[];
};

const NavLink: React.FC<Props> = ({ children, path, pathMatches }) => {
  const router = useRouter();

  const isActive =
    pathMatches?.includes(router.pathname) || path === router.pathname;

  return (
    <Link
      href={path}
      className={classNames(
        "transition-colors",
        isActive ? " text-yellow-400" : "text-slate-400 hover:text-slate-200"
      )}
    >
      {children}
    </Link>
  );
};

const MainNav = () => {
  return (
    <header className="absolute top-5 left-5 z-20 flex h-12 items-center rounded-lg text-slate-900">
      <div className="flex h-12 items-center rounded-l-lg bg-yellow-400 px-3 py-2">
        <Image
          src="/bike-logo.png"
          width="40"
          height="28"
          alt=""
          className="mr-3"
        />
        <h1 className="mr-1 flex flex-col">
          <span className="text-md font-bold leading-none">Helsinki </span>
          <span className="text-sm leading-none tracking-tight">
            City Bikes
          </span>
        </h1>
      </div>
      <nav className="flex h-12 items-center gap-4 rounded-r-lg border border-yellow-400 bg-slate-900 bg-opacity-70 py-3 px-5 backdrop-blur-lg">
        <NavLink path="/" pathMatches={["/", "/stations/[stationId]"]}>
          Stations
        </NavLink>
      </nav>
    </header>
  );
};

export default MainNav;

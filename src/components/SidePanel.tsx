import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  width?: "narrow" | "wide";
};

const SidePanel: React.FC<Props> = ({ children, width = "narrow" }) => {
  return (
    <div
      className={classNames(
        "absolute top-10 right-10 z-10 max-h-[calc(100vh-5rem)] overflow-x-hidden overflow-y-scroll rounded-lg border border-cyan-800 bg-slate-900 bg-opacity-70 p-5 drop-shadow-2xl backdrop-blur-lg",
        width === "narrow" ? "w-64" : "w-96"
      )}
    >
      {children}
    </div>
  );
};

export default SidePanel;

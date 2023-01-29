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
        "sidepanel absolute top-5 right-5 z-10 overflow-x-hidden overflow-y-scroll rounded-lg border border-cyan-800 bg-slate-900 bg-opacity-70 p-5 drop-shadow-2xl backdrop-blur-lg",
        width === "narrow" ? "max-h-[50vh] w-64" : "max-h-[95vh] w-96"
      )}
    >
      {children}
    </div>
  );
};

export default SidePanel;

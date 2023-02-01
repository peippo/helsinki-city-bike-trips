import React from "react";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  width?: "narrow" | "wide";
};

const SidePanel: React.FC<Props> = ({ children, width = "narrow" }) => {
  return (
    <div
      className={classNames(
        "right-5 bottom-5 left-5 max-h-[40vh]",
        "lg:left-auto lg:bottom-auto lg:top-5",
        "sidepanel absolute z-10 overflow-x-hidden overflow-y-scroll rounded-lg border border-cyan-800 bg-slate-900 bg-opacity-70 p-5 drop-shadow-2xl backdrop-blur-lg",
        width === "narrow"
          ? "lg:max-h-[50vh] lg:w-64"
          : "lg:max-h-[95vh] lg:w-96"
      )}
    >
      {children}
    </div>
  );
};

export default SidePanel;

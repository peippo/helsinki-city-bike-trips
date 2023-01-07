import React from "react";

type Props = {
  children: React.ReactNode;
};

const SidePanel: React.FC<Props> = ({ children }) => {
  return (
    <div className="absolute top-10 right-10 h-[calc(100vh-5rem)] w-64 overflow-y-scroll rounded-lg border border-cyan-800 p-5 backdrop-blur-lg">
      {children}
    </div>
  );
};

export default SidePanel;

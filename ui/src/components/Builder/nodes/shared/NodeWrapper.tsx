import React from "react";

interface NodeWrapperProps {
  selected: boolean;
  className?: string;
  children: React.ReactNode;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  selected,
  className = "",
  children,
}) => {
  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg
        shadow-sm hover:shadow-md transition-shadow
        ${selected ? "ring-2 ring-blue-400" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};
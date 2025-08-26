import React from "react";
import { Handle, Position } from "@xyflow/react";

interface NodeHandleProps {
  id: string;
  type: "source" | "target";
  position: Position;
  color: string;
  style?: React.CSSProperties;
}

export const NodeHandle: React.FC<NodeHandleProps> = ({
  id,
  type,
  position,
  color,
  style,
}) => {
  return (
    <Handle
      className={`w-3 h-3 ${color} border-2 border-white`}
      id={id}
      position={position}
      style={style}
      type={type}
    />
  );
};
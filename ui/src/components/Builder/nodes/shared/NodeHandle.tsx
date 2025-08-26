import React from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useWorkflowBuilder } from "../../../../providers/flow-provider";

interface NodeHandleProps {
  id: string;
  type: "source" | "target";
  position: Position;
  color: string;
  style?: React.CSSProperties;
  nodeId?: string;
}

export const NodeHandle: React.FC<NodeHandleProps> = ({
  id,
  type,
  position,
  color,
  style,
  nodeId,
}) => {
  const { pendingConnection, onHandleClick, isHandleAvailable } = useWorkflowBuilder();
  const { getNode } = useReactFlow();

  // Get the actual node ID if not provided
  const actualNodeId = nodeId || getNode(id)?.id;

  if (!actualNodeId) {
    return (
      <Handle
        className={`w-3 h-3 ${color} border-2 border-white`}
        id={id}
        position={position}
        style={style}
        type={type}
      />
    );
  }

  const isAvailable = isHandleAvailable(actualNodeId, id, type);
  const isPending = pendingConnection?.nodeId === actualNodeId && pendingConnection?.handleId === id;
  const isCompatible = pendingConnection && 
    pendingConnection.nodeId !== actualNodeId && 
    pendingConnection.handleType !== type &&
    isAvailable;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAvailable) {
      onHandleClick(actualNodeId, id, type);
    }
  };

  // Determine visual state
  let handleClasses = `w-3 h-3 border-2 border-white transition-all duration-200 cursor-pointer`;
  
  if (isPending) {
    handleClasses += ` ${color} ring-2 ring-blue-400 ring-opacity-75 scale-125`;
  } else if (isCompatible) {
    handleClasses += ` ${color} ring-2 ring-green-400 ring-opacity-75 scale-110 animate-pulse`;
  } else if (isAvailable) {
    handleClasses += ` ${color} hover:scale-110`;
  } else {
    handleClasses += ` bg-gray-400 cursor-not-allowed opacity-50`;
  }

  return (
    <Handle
      className={handleClasses}
      id={id}
      position={position}
      style={style}
      type={type}
      onClick={handleClick}
    />
  );
};

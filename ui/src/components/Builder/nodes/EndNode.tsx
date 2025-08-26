import React from "react";
import { Position, NodeProps } from "@xyflow/react";

import { EndNode as EndNodeType } from "../../../types/workflow-nodes";
import { useNodeEditing } from "../../../hooks";
import { NodeWrapper, NodeInput, NodeHandle } from "./shared";

interface EndNodeProps extends NodeProps<EndNodeType> {}

export const EndNode: React.FC<EndNodeProps> = ({ id, data, selected }) => {
  const { label, handleLabelChange, handleKeyDown } = useNodeEditing(id, data);

  return (
    <NodeWrapper
      className="min-w-[120px] min-h-[60px] bg-red-100 border-2 border-red-200"
      selected={selected}
    >
      {/* Input Handle - Top */}
      <NodeHandle
        color="bg-red-500"
        id="input"
        position={Position.Top}
        style={{
          top: -6,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        type="target"
      />

      {/* Node Content */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-xs font-medium text-red-700 mb-1">END</div>
        <NodeInput
          borderColor="border-red-300"
          value={label}
          onChange={handleLabelChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </NodeWrapper>
  );
};

import React from "react";
import { Position, NodeProps } from "@xyflow/react";

import { StartNode as StartNodeType } from "../../../types/workflow-nodes";
import { useNodeEditing, useNodeToolbar } from "../../../hooks";

import {
  NodeWrapper,
  NodeInput,
  NodeHandle,
  CustomNodeToolbar,
} from "./shared";

interface StartNodeProps extends NodeProps<StartNodeType> {}

export const StartNode: React.FC<StartNodeProps> = ({ id, data, selected }) => {
  const { label, handleLabelChange, handleKeyDown } = useNodeEditing(id, data);
  const { handleDuplicate, handleDelete, handleDetach } = useNodeToolbar(
    id,
    data,
  );

  return (
    <>
      <CustomNodeToolbar
        isVisible={selected}
        onDelete={handleDelete}
        onDetach={handleDetach}
        onDuplicate={handleDuplicate}
      />

      <NodeWrapper
        className="min-w-[120px] min-h-[60px] bg-green-100 border-2 border-green-200"
        selected={selected}
      >
        {/* Node Content */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-xs font-medium text-green-700 mb-1">START</div>
          <NodeInput
            borderColor="border-green-300"
            value={label}
            onChange={handleLabelChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Output Handle - Bottom */}
        <NodeHandle
          color="bg-green-500"
          id="output"
          nodeId={id}
          position={Position.Bottom}
          style={{
            bottom: -6,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          type="source"
        />
      </NodeWrapper>
    </>
  );
};

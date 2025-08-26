import React, { useState, useCallback } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Input } from "@heroui/input";

import { EndNode as EndNodeType } from "../../../types/workflow-nodes";

interface EndNodeProps extends NodeProps<EndNodeType> {}

export const EndNode: React.FC<EndNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: This will be connected to the flow provider in a later task
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setLabel(data.label);
    setIsEditing(false);
  }, [data.label]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  return (
    <div
      className={`
        relative min-w-[120px] min-h-[60px] px-4 py-3
        bg-red-100 border-2 border-red-200 rounded-lg
        shadow-sm hover:shadow-md transition-shadow
        ${selected ? "ring-2 ring-blue-400" : ""}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Input Handle - Top */}
      <Handle
        className="w-3 h-3 bg-red-500 border-2 border-white"
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

        {isEditing ? (
          <Input
            className="w-full"
            classNames={{
              input: "text-center text-sm",
              inputWrapper: "bg-white border-red-300",
            }}
            size="sm"
            value={label}
            variant="bordered"
            onBlur={handleSave}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div className="text-sm font-semibold text-red-800 cursor-pointer">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

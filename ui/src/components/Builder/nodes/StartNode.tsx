import React, { useState, useCallback } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Input } from "@heroui/input";

import { StartNode as StartNodeType } from "../../../types/workflow-nodes";

interface StartNodeProps extends NodeProps<StartNodeType> {}

export const StartNode: React.FC<StartNodeProps> = ({ data, selected }) => {
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
        bg-green-100 border-2 border-green-200 rounded-lg
        shadow-sm hover:shadow-md transition-shadow
        ${selected ? "ring-2 ring-blue-400" : ""}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Node Content */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-xs font-medium text-green-700 mb-1">START</div>

        {isEditing ? (
          <Input
            className="w-full"
            classNames={{
              input: "text-center text-sm",
              inputWrapper: "bg-white border-green-300",
            }}
            size="sm"
            value={label}
            variant="bordered"
            onBlur={handleSave}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div className="text-sm font-semibold text-green-800 cursor-pointer">
            {label}
          </div>
        )}
      </div>

      {/* Output Handle - Bottom */}
      <Handle
        className="w-3 h-3 bg-green-500 border-2 border-white"
        id="output"
        position={Position.Bottom}
        style={{
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        type="source"
      />
    </div>
  );
};

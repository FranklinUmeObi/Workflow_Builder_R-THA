import React, { useState, useCallback } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";

import {
  DecisionNode as DecisionNodeType,
  DecisionCondition,
} from "../../../types/workflow-nodes";

interface DecisionNodeProps extends NodeProps<DecisionNodeType> {}

const operators = [
  { key: "==", label: "equals" },
  { key: "!=", label: "not equals" },
  { key: ">", label: "greater than" },
  { key: "<", label: "less than" },
  { key: ">=", label: "greater or equal" },
  { key: "<=", label: "less or equal" },
  { key: "contains", label: "contains" },
  { key: "startsWith", label: "starts with" },
  { key: "endsWith", label: "ends with" },
];

export const DecisionNode: React.FC<DecisionNodeProps> = ({
  data,
  selected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [condition, setCondition] = useState<DecisionCondition>(
    data.condition || { leftOperand: "", operator: "==", rightOperand: "" },
  );
  const [showCondition, setShowCondition] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: This will be connected to the flow provider in a later task
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setLabel(data.label);
    setCondition(
      data.condition || { leftOperand: "", operator: "==", rightOperand: "" },
    );
    setIsEditing(false);
    setShowCondition(false);
  }, [data.label, data.condition]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel],
  );

  const updateCondition = useCallback(
    (field: keyof DecisionCondition, value: string) => {
      setCondition((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  return (
    <div
      className={`
        relative min-w-[160px] min-h-[100px] px-4 py-3
        bg-blue-100 border-2 border-blue-200 rounded-lg
        shadow-sm hover:shadow-md transition-shadow
        ${selected ? "ring-2 ring-blue-400" : ""}
        transform rotate-45 origin-center
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Input Handle - Top */}
      <Handle
        className="w-3 h-3 bg-blue-500 border-2 border-white"
        id="input"
        position={Position.Top}
        style={{
          top: -6,
          left: "50%",
          transform: "translateX(-50%) rotate(-45deg)",
        }}
        type="target"
      />

      {/* Node Content - Counter-rotate to keep text readable */}
      <div className="transform -rotate-45 flex flex-col items-center justify-center text-center">
        <div className="text-xs font-medium text-blue-700 mb-1">DECISION</div>

        {isEditing ? (
          <div className="w-full space-y-2">
            <Input
              className="w-full"
              classNames={{
                input: "text-center text-sm",
                inputWrapper: "bg-white border-blue-300",
              }}
              placeholder="Decision name"
              size="sm"
              value={label}
              variant="bordered"
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <div className="flex items-center justify-center gap-2">
              <Button
                className="text-xs"
                color="primary"
                size="sm"
                variant="flat"
                onClick={() => setShowCondition(!showCondition)}
              >
                {showCondition ? "Hide Condition" : "Show Condition"}
              </Button>
            </div>

            {showCondition && (
              <div className="space-y-2 p-2 bg-white rounded border border-blue-200">
                <div className="text-xs font-medium text-blue-700">
                  Condition
                </div>

                <div className="space-y-2">
                  <Input
                    className="w-full"
                    classNames={{
                      input: "text-xs",
                      inputWrapper: "min-h-unit-8",
                    }}
                    placeholder="Left operand"
                    size="sm"
                    value={condition.leftOperand}
                    variant="bordered"
                    onChange={(e) =>
                      updateCondition("leftOperand", e.target.value)
                    }
                  />

                  <Select
                    className="w-full"
                    classNames={{
                      trigger: "min-h-unit-8",
                      value: "text-xs",
                    }}
                    placeholder="Select operator"
                    selectedKeys={[condition.operator]}
                    size="sm"
                    variant="bordered"
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0] as string;

                      updateCondition("operator", selectedKey);
                    }}
                  >
                    {operators.map((op) => (
                      <SelectItem key={op.key}>{op.label}</SelectItem>
                    ))}
                  </Select>

                  <Input
                    className="w-full"
                    classNames={{
                      input: "text-xs",
                      inputWrapper: "min-h-unit-8",
                    }}
                    placeholder="Right operand"
                    size="sm"
                    value={condition.rightOperand}
                    variant="bordered"
                    onChange={(e) =>
                      updateCondition("rightOperand", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-sm font-semibold text-blue-800 cursor-pointer">
              {label}
            </div>
            {(condition.leftOperand || condition.rightOperand) && (
              <div className="text-xs text-blue-600">
                {condition.leftOperand} {condition.operator}{" "}
                {condition.rightOperand}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Handles - Bottom Left and Right */}
      <Handle
        className="w-3 h-3 bg-green-500 border-2 border-white"
        id="yes"
        position={Position.Bottom}
        style={{
          bottom: -6,
          left: "25%",
          transform: "translateX(-50%) rotate(-45deg)",
        }}
        type="source"
      />

      <Handle
        className="w-3 h-3 bg-red-500 border-2 border-white"
        id="no"
        position={Position.Bottom}
        style={{
          bottom: -6,
          right: "25%",
          transform: "translateX(50%) rotate(-45deg)",
        }}
        type="source"
      />
    </div>
  );
};

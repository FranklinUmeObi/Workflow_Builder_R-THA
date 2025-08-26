import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";

import { DecisionNode as DecisionNodeType } from "../../../types/workflow-nodes";
import {
  useNodeEditing,
  useDecisionCondition,
  useNodeToolbar,
} from "../../../hooks";

import {
  NodeWrapper,
  NodeInput,
  NodeHandle,
  CustomNodeToolbar,
} from "./shared";

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
  id,
  data,
  selected,
}) => {
  const { label, handleLabelChange, handleKeyDown, updateNodeData } =
    useNodeEditing(id, data);
  const { condition, showCondition, setShowCondition, updateCondition } =
    useDecisionCondition(id, data, updateNodeData);
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
        className="min-w-[160px] min-h-[100px] bg-blue-100 border-2 border-blue-200"
        selected={selected}
      >
        {/* Input Handle - Top */}
        <NodeHandle
          color="bg-blue-500"
          id="input"
          position={Position.Top}
          style={{
            top: -6,
            left: "50%",
          }}
          type="target"
        />

        {/* Node Content */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-xs font-medium text-blue-700 mb-1">DECISION</div>

          <div className="w-full space-y-2">
            <NodeInput
              borderColor="border-blue-300"
              placeholder="Decision name"
              value={label}
              onChange={handleLabelChange}
              onKeyDown={handleKeyDown}
            />

            <div className="flex items-center justify-center gap-2">
              <Button
                className="text-xs"
                color="primary"
                size="sm"
                variant="flat"
                onPress={() => setShowCondition(!showCondition)}
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
                    onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Output Handles - Bottom Left and Right */}
        <NodeHandle
          color="bg-green-500"
          id="yes"
          position={Position.Bottom}
          style={{
            bottom: -6,
            left: "25%",
            transform: "translateX(-50%) rotate(-45deg)",
          }}
          type="source"
        />

        <NodeHandle
          color="bg-red-500"
          id="no"
          position={Position.Bottom}
          style={{
            bottom: -6,
            right: "25%",
            transform: "translateX(50%) rotate(-45deg)",
          }}
          type="source"
        />
      </NodeWrapper>
    </>
  );
};

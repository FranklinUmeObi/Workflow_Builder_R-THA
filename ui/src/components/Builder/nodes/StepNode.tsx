import React from "react";
import { Position, NodeProps } from "@xyflow/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { StepNode as StepNodeType } from "../../../types/workflow-nodes";
import { useNodeEditing, useStepConfig, useNodeToolbar } from "../../../hooks";

import {
  NodeWrapper,
  NodeInput,
  NodeHandle,
  CustomNodeToolbar,
} from "./shared";

interface StepNodeProps extends NodeProps<StepNodeType> {}

export const StepNode: React.FC<StepNodeProps> = ({ id, data, selected }) => {
  const { label, handleLabelChange, handleKeyDown, updateNodeData } =
    useNodeEditing(id, data);
  const {
    config,
    showConfig,
    setShowConfig,
    addConfigPair,
    updateConfigKey,
    updateConfigValue,
    removeConfigPair,
  } = useStepConfig(id, data, updateNodeData);
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
        className="min-w-[140px] min-h-[80px] bg-orange-100 border-2 border-orange-200"
        selected={selected}
      >
        {/* Input Handle - Top */}
        <NodeHandle
          color="bg-orange-500"
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
          <div className="text-xs font-medium text-orange-700 mb-1">STEP</div>

          <div className="w-full space-y-2">
            <NodeInput
              borderColor="border-orange-300"
              placeholder="Step name"
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
                onPress={() => setShowConfig(!showConfig)}
              >
                {showConfig ? "Hide Config" : "Show Config"}
              </Button>
            </div>

            {showConfig && (
              <div className="space-y-2 p-2 bg-white rounded border border-orange-200">
                <div className="text-xs font-medium text-orange-700">
                  Configuration
                </div>

                {Object.entries(config).map(([key, value]) => (
                  <div key={key} className="flex gap-1 items-center">
                    <Input
                      className="flex-1"
                      classNames={{
                        input: "text-xs",
                        inputWrapper: "min-h-unit-8",
                      }}
                      placeholder="Key"
                      size="sm"
                      value={key}
                      variant="bordered"
                      onChange={(e) => updateConfigKey(key, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Input
                      className="flex-1"
                      classNames={{
                        input: "text-xs",
                        inputWrapper: "min-h-unit-8",
                      }}
                      placeholder="Value"
                      size="sm"
                      value={value}
                      variant="bordered"
                      onChange={(e) => updateConfigValue(key, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      className="min-w-unit-8 w-unit-8 h-unit-8 p-0"
                      color="danger"
                      size="sm"
                      variant="flat"
                      onPress={() => removeConfigPair(key)}
                    >
                      ×
                    </Button>
                  </div>
                ))}

                <Button
                  className="w-full text-xs"
                  color="success"
                  size="sm"
                  variant="flat"
                  onPress={addConfigPair}
                >
                  + Add Config
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Output Handle - Bottom */}
        <NodeHandle
          color="bg-orange-500"
          id="output"
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

import React, { useState, useCallback } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { StepNode as StepNodeType } from "../../../types/workflow-nodes";

interface StepNodeProps extends NodeProps<StepNodeType> {}

export const StepNode: React.FC<StepNodeProps> = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [config, setConfig] = useState(data.config || {});
  const [showConfig, setShowConfig] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: This will be connected to the flow provider in a later task
    setIsEditing(false);
  }, []);

  const handleCancel = useCallback(() => {
    setLabel(data.label);
    setConfig(data.config || {});
    setIsEditing(false);
    setShowConfig(false);
  }, [data.label, data.config]);

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

  const addConfigPair = useCallback(() => {
    const newKey = `key${Object.keys(config).length + 1}`;

    setConfig((prev) => ({ ...prev, [newKey]: "" }));
  }, [config]);

  const updateConfigKey = useCallback((oldKey: string, newKey: string) => {
    if (oldKey === newKey) return;

    setConfig((prev) => {
      const newConfig = { ...prev };

      newConfig[newKey] = newConfig[oldKey];
      delete newConfig[oldKey];

      return newConfig;
    });
  }, []);

  const updateConfigValue = useCallback((key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const removeConfigPair = useCallback((key: string) => {
    setConfig((prev) => {
      const newConfig = { ...prev };

      delete newConfig[key];

      return newConfig;
    });
  }, []);

  return (
    <div
      className={`
        relative min-w-[140px] min-h-[80px] px-4 py-3
        bg-orange-100 border-2 border-orange-200 rounded-lg
        shadow-sm hover:shadow-md transition-shadow
        ${selected ? "ring-2 ring-blue-400" : ""}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Input Handle - Top */}
      <Handle
        className="w-3 h-3 bg-orange-500 border-2 border-white"
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

        {isEditing ? (
          <div className="w-full space-y-2">
            <Input
              className="w-full"
              classNames={{
                input: "text-center text-sm",
                inputWrapper: "bg-white border-orange-300",
              }}
              placeholder="Step name"
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
                onClick={() => setShowConfig(!showConfig)}
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
                    />
                    <Button
                      className="min-w-unit-8 w-unit-8 h-unit-8 p-0"
                      color="danger"
                      size="sm"
                      variant="flat"
                      onClick={() => removeConfigPair(key)}
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
                  onClick={addConfigPair}
                >
                  + Add Config
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-sm font-semibold text-orange-800 cursor-pointer">
              {label}
            </div>
            {Object.keys(config).length > 0 && (
              <div className="text-xs text-orange-600">
                {Object.keys(config).length} config
                {Object.keys(config).length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Output Handle - Bottom */}
      <Handle
        className="w-3 h-3 bg-orange-500 border-2 border-white"
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

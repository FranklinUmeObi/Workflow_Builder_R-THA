import { useState, useCallback, useEffect } from "react";
import { StepNode } from "../types/workflow-nodes";

export const useStepConfig = (
  _id: string,
  data: StepNode["data"],
  updateNodeData: (updates: Partial<StepNode["data"]>) => void,
) => {
  const [config, setConfig] = useState(data.config || {});
  const [showConfig, setShowConfig] = useState(false);

  // Sync local state with data
  useEffect(() => {
    setConfig(data.config || {});
  }, [data.config]);

  const addConfigPair = useCallback(() => {
    const newKey = `key${Object.keys(config).length + 1}`;
    const newConfig = { ...config, [newKey]: "" };
    setConfig(newConfig);
    updateNodeData({ config: newConfig });
  }, [config, updateNodeData]);

  const updateConfigKey = useCallback(
    (oldKey: string, newKey: string) => {
      if (oldKey === newKey) return;

      const newConfig = { ...config };
      newConfig[newKey] = newConfig[oldKey];
      delete newConfig[oldKey];

      setConfig(newConfig);
      // Debounce the update
      setTimeout(() => {
        updateNodeData({ config: newConfig });
      }, 100);
    },
    [config, updateNodeData],
  );

  const updateConfigValue = useCallback(
    (key: string, value: string) => {
      const newConfig = { ...config, [key]: value };
      setConfig(newConfig);
      // Debounce the update
      setTimeout(() => {
        updateNodeData({ config: newConfig });
      }, 100);
    },
    [config, updateNodeData],
  );

  const removeConfigPair = useCallback(
    (key: string) => {
      const newConfig = { ...config };
      delete newConfig[key];
      setConfig(newConfig);
      updateNodeData({ config: newConfig });
    },
    [config, updateNodeData],
  );

  return {
    config,
    showConfig,
    setShowConfig,
    addConfigPair,
    updateConfigKey,
    updateConfigValue,
    removeConfigPair,
  };
};
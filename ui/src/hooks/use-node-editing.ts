import { useState, useCallback, useEffect } from "react";

import { useWorkflowBuilder } from "../providers/flow-provider";
import { CustomWorkflowNode } from "../types/workflow-nodes";

export const useNodeEditing = <T extends CustomWorkflowNode>(
  id: string,
  data: T["data"],
) => {
  const { updateNode } = useWorkflowBuilder();
  const [label, setLabel] = useState(data.label);

  // Sync local state with data
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleLabelChange = useCallback(
    (newLabel: string) => {
      setLabel(newLabel);
      // Update the node data immediately
      updateNode(id, {
        id,
        type: data.nodeType,
        position: { x: 0, y: 0 }, // This will be preserved by the updateNode function
        data: {
          ...data,
          label: newLabel,
        },
      } as CustomWorkflowNode);
    },
    [id, data, updateNode],
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Prevent ReactFlow from handling these keys
    if (e.key === "Delete" || e.key === "Backspace") {
      e.stopPropagation();
    }
  }, []);

  const updateNodeData = useCallback(
    (updates: Partial<T["data"]>) => {
      updateNode(id, {
        id,
        type: data.nodeType,
        position: { x: 0, y: 0 }, // This will be preserved by the updateNode function
        data: {
          ...data,
          ...updates,
        },
      } as CustomWorkflowNode);
    },
    [id, data, updateNode],
  );

  return {
    label,
    setLabel,
    handleLabelChange,
    handleKeyDown,
    updateNodeData,
  };
};

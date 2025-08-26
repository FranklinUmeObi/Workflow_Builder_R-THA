import { useState, useCallback, useEffect } from "react";

import { DecisionNode, DecisionCondition } from "../types/workflow-nodes";

export const useDecisionCondition = (
  _id: string,
  data: DecisionNode["data"],
  updateNodeData: (updates: Partial<DecisionNode["data"]>) => void,
) => {
  const [condition, setCondition] = useState<DecisionCondition>(
    data.condition || { leftOperand: "", operator: "==", rightOperand: "" },
  );
  const [showCondition, setShowCondition] = useState(false);

  // Sync local state with data
  useEffect(() => {
    setCondition(
      data.condition || { leftOperand: "", operator: "==", rightOperand: "" },
    );
  }, [data.condition]);

  const updateCondition = useCallback(
    (field: keyof DecisionCondition, value: string) => {
      const newCondition = { ...condition, [field]: value };

      setCondition(newCondition);

      // Debounce the update
      setTimeout(() => {
        updateNodeData({ condition: newCondition });
      }, 100);
    },
    [condition, updateNodeData],
  );

  return {
    condition,
    showCondition,
    setShowCondition,
    updateCondition,
  };
};

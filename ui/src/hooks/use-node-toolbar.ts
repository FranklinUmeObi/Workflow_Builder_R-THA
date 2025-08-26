import { useCallback } from "react";

import { useWorkflowBuilder } from "../providers/flow-provider";
import { CustomWorkflowNode } from "../types/workflow-nodes";

export const useNodeToolbar = (
  id: string,
  _data: CustomWorkflowNode["data"],
) => {
  const { duplicateNode, removeNode, getNodeEdges, removeEdge } =
    useWorkflowBuilder();

  const handleDuplicate = useCallback(() => {
    duplicateNode(id);
  }, [id, duplicateNode]);

  const handleDelete = useCallback(() => {
    removeNode(id);
  }, [id, removeNode]);

  const handleDetach = useCallback(() => {
    // Get all edges connected to this node
    const connectedEdges = getNodeEdges(id);

    // Remove all connected edges
    connectedEdges.forEach((edge) => {
      removeEdge(edge.id);
    });
  }, [id, getNodeEdges, removeEdge]);

  return {
    handleDuplicate,
    handleDelete,
    handleDetach,
  };
};

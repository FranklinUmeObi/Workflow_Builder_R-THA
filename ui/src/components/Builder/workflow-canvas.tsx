import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";

import { useWorkflowBuilder } from "@/providers/flow-provider";
import { useWorkflowShortcuts } from "@/hooks/use-workflow-shortcuts";

export const WorkflowCanvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowBuilder();

  useWorkflowShortcuts({ enabled: true });

  return (
    <ReactFlow
      fitView
      edges={edges}
      nodes={nodes}
      onConnect={onConnect}
      onEdgesChange={onEdgesChange}
      onNodesChange={onNodesChange}
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

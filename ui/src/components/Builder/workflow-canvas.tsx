import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, DragEvent } from "react";

import { useWorkflowBuilder } from "@/providers/flow-provider";
import { useWorkflowShortcuts } from "@/hooks/use-workflow-shortcuts";
import { useDragDrop } from "@/providers/drag-drop-provider";

export const WorkflowCanvas = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { draggedNodeType, onDragOver, onDrop } = useDragDrop();

  const { nodes, addNode, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowBuilder();

  useWorkflowShortcuts({ enabled: true });

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // Check if the dropped element is valid
      if (!draggedNodeType) {
        onDrop(event);

        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode({
        data: { label: `${draggedNodeType} node` },
        position,
        type: draggedNodeType ?? "default",
      });

      // Clean up drag state
      onDrop(event);
    },
    [screenToFlowPosition, draggedNodeType, addNode, onDrop],
  );

  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        fitView
        edges={edges}
        nodes={nodes}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={handleDrop}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

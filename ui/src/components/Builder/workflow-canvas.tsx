import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, DragEvent, useMemo } from "react";

import { ValidationBadge } from "./ValidationBadge";
import { StartNode } from "./nodes/StartNode";
import { StepNode } from "./nodes/StepNode";
import { DecisionNode } from "./nodes/DecisionNode";
import { EndNode } from "./nodes/EndNode";

import {
  createDefaultStartNode,
  createDefaultStepNode,
  createDefaultDecisionNode,
  createDefaultEndNode,
} from "@/types/workflow-nodes";
import { useDragDrop } from "@/providers/drag-drop-provider";
import { useWorkflowShortcuts } from "@/hooks/use-workflow-shortcuts";
import { useWorkflowBuilder } from "@/providers/flow-provider";

export const WorkflowCanvas = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { draggedNodeType, onDragOver, onDrop } = useDragDrop();

  const { nodes, addNode, edges, onNodesChange, onEdgesChange, onConnect } =
    useWorkflowBuilder();

  useWorkflowShortcuts({ enabled: true });

  // Register custom node types
  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      step: StepNode,
      decision: DecisionNode,
      end: EndNode,
    }),
    [],
  );

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

      const nodeId = `node-${Date.now()}`;

      // Create the appropriate node type based on draggedNodeType
      let newNode;

      switch (draggedNodeType) {
        case "start":
          newNode = createDefaultStartNode(nodeId, position);
          break;
        case "step":
          newNode = createDefaultStepNode(nodeId, position);
          break;
        case "decision":
          newNode = createDefaultDecisionNode(nodeId, position);
          break;
        case "end":
          newNode = createDefaultEndNode(nodeId, position);
          break;
        default:
          // Fallback to start node if type is unknown
          newNode = createDefaultStartNode(nodeId, position);
      }

      addNode(newNode);

      // Clean up drag state
      onDrop(event);
    },
    [screenToFlowPosition, draggedNodeType, addNode, onDrop],
  );

  return (
    <div className="reactflow-wrapper relative">
      <ReactFlow
        fitView
        edges={edges}
        nodeTypes={nodeTypes}
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

      {/* Validation Badge positioned in top-left corner */}
      <div className="absolute top-4 left-4 z-10">
        <ValidationBadge />
      </div>
    </div>
  );
};

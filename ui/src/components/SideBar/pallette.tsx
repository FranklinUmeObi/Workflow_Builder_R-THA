import { useDragDrop } from "@/providers/drag-drop-provider";
import { useWorkflowBuilder } from "@/providers/flow-provider";
import {
  createDefaultStartNode,
  createDefaultStepNode,
  createDefaultDecisionNode,
  createDefaultEndNode,
} from "@/types/workflow-nodes";

export const Palette = () => {
  const { onDragStart, isDragging, draggedNodeType } = useDragDrop();
  const { addNode, nodes, edges } = useWorkflowBuilder();

  const handleClickToAdd = (nodeType: string) => {
    const nodeId = `node-${Date.now()}`;

    // Calculate position to avoid overlapping with existing nodes
    const baseX = 100;
    const baseY = 100;
    const offsetX = 150; // Horizontal spacing between nodes
    const offsetY = 120; // Vertical spacing between nodes

    // Find a position that doesn't overlap with existing nodes
    let position = { x: baseX, y: baseY };
    let attempts = 0;
    const maxAttempts = 20;

    while (attempts < maxAttempts) {
      const hasOverlap = nodes.some((node) => {
        const dx = Math.abs(node.position.x - position.x);
        const dy = Math.abs(node.position.y - position.y);

        return dx < offsetX && dy < offsetY;
      });

      if (!hasOverlap) {
        break;
      }

      // Try next position in a grid pattern
      attempts++;
      const row = Math.floor(attempts / 3);
      const col = attempts % 3;

      position = {
        x: baseX + col * offsetX,
        y: baseY + row * offsetY,
      };
    }

    let newNode;

    switch (nodeType) {
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
        return;
    }

    addNode(newNode);
  };

  const handleExportWorkflow = () => {
    const workflowData = {
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflow-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right or click to add them.
      </div>

      {/* Start Node */}
      <button
        draggable
        className={`dndnode-custom start-node ${isDragging && draggedNodeType === "start" ? "dragging" : ""}`}
        onClick={() => handleClickToAdd("start")}
        onDragStart={(event) => onDragStart(event, "start")}
      >
        <div className="node-preview start-preview">
          <div className="node-type-label">START</div>
          <div className="node-name">Start Node</div>
          <div className="handle-preview bottom" />
        </div>
      </button>

      {/* Step Node */}
      <button
        draggable
        className={`dndnode-custom step-node ${isDragging && draggedNodeType === "step" ? "dragging" : ""}`}
        onClick={() => handleClickToAdd("step")}
        onDragStart={(event) => onDragStart(event, "step")}
      >
        <div className="node-preview step-preview">
          <div className="handle-preview top" />
          <div className="node-type-label">STEP</div>
          <div className="node-name">Step Node</div>
          <div className="handle-preview bottom" />
        </div>
      </button>

      {/* Decision Node */}
      <button
        draggable
        className={`dndnode-custom decision-node ${isDragging && draggedNodeType === "decision" ? "dragging" : ""}`}
        onClick={() => handleClickToAdd("decision")}
        onDragStart={(event) => onDragStart(event, "decision")}
      >
        <div className="node-preview decision-preview">
          <div className="handle-preview top" />
          <div className="node-type-label">DECISION</div>
          <div className="node-name">Decision Node</div>
          <div className="handle-preview bottom-left" />
          <div className="handle-preview bottom-right" />
        </div>
      </button>

      {/* End Node */}
      <button
        draggable
        className={`dndnode-custom end-node ${isDragging && draggedNodeType === "end" ? "dragging" : ""}`}
        onClick={() => handleClickToAdd("end")}
        onDragStart={(event) => onDragStart(event, "end")}
      >
        <div className="node-preview end-preview">
          <div className="handle-preview top" />
          <div className="node-type-label">END</div>
          <div className="node-name">End Node</div>
        </div>
      </button>

      {/* Export Button */}
      <button
        className="export-button"
        onClick={handleExportWorkflow}
        title="Export workflow as JSON"
      >
        <div className="export-content">
          <div className="export-icon">📥</div>
          <div className="export-text">Export Workflow</div>
        </div>
      </button>
    </aside>
  );
};

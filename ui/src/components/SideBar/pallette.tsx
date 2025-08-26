import { useDragDrop } from "@/providers/drag-drop-provider";
import { useWorkflowBuilder } from "@/providers/flow-provider";
import {
  createDefaultStartNode,
  createDefaultStepNode,
  createDefaultDecisionNode,
  createDefaultEndNode,
} from "@/types/workflow-nodes";

export const Palette = () => {
  const { onDragStart } = useDragDrop();
  const { addNode, nodes } = useWorkflowBuilder();

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

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right or click to add them.
      </div>

      {/* Start Node */}
      <div
        draggable
        className="dndnode-custom start-node"
        onClick={() => handleClickToAdd("start")}
        onDragStart={(event) => onDragStart(event, "start")}
      >
        <div className="node-preview start-preview">
          <div className="node-type-label">START</div>
          <div className="node-name">Start Node</div>
          <div className="handle-preview bottom" />
        </div>
      </div>

      {/* Step Node */}
      <div
        draggable
        className="dndnode-custom step-node"
        onClick={() => handleClickToAdd("step")}
        onDragStart={(event) => onDragStart(event, "step")}
      >
        <div className="node-preview step-preview">
          <div className="handle-preview top" />
          <div className="node-type-label">STEP</div>
          <div className="node-name">Step Node</div>
          <div className="handle-preview bottom" />
        </div>
      </div>

      {/* Decision Node */}
      <div
        draggable
        className="dndnode-custom decision-node"
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
      </div>

      {/* End Node */}
      <div
        draggable
        className="dndnode-custom end-node"
        onClick={() => handleClickToAdd("end")}
        onDragStart={(event) => onDragStart(event, "end")}
      >
        <div className="node-preview end-preview">
          <div className="handle-preview top" />
          <div className="node-type-label">END</div>
          <div className="node-name">End Node</div>
        </div>
      </div>
    </aside>
  );
};

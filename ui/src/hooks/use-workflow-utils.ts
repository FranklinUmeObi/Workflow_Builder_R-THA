import { useCallback } from "react";
import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "@xyflow/react";

import { useWorkflowBuilder } from "@/providers/flow-provider";
import { CustomWorkflowNode } from "@/types/workflow-nodes";

export const useWorkflowUtils = () => {
  const reactFlowInstance = useReactFlow();
  const { nodes, edges, addNode, updateNode } = useWorkflowBuilder();

  const isReactFlowReady = Boolean(reactFlowInstance);
  // Viewport and positioning utilities
  const fitView = useCallback(
    (options?: { padding?: number; duration?: number }) => {
      if (!isReactFlowReady) return;
      reactFlowInstance.fitView(options);
    },
    [reactFlowInstance, isReactFlowReady],
  );

  const centerView = useCallback(() => {
    if (!isReactFlowReady) return;
    const bounds = getNodesBounds(nodes);
    const viewport = getViewportForBounds(bounds, 800, 600, 0.1, 2, 2);

    reactFlowInstance.setViewport(viewport, { duration: 300 });
  }, [reactFlowInstance, nodes, isReactFlowReady]);

  const zoomIn = useCallback(() => {
    if (!isReactFlowReady) return;
    reactFlowInstance.zoomIn({ duration: 300 });
  }, [reactFlowInstance, isReactFlowReady]);

  const zoomOut = useCallback(() => {
    if (!isReactFlowReady) return;
    reactFlowInstance.zoomOut({ duration: 300 });
  }, [reactFlowInstance, isReactFlowReady]);

  const resetZoom = useCallback(() => {
    if (!isReactFlowReady) return;
    reactFlowInstance.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
  }, [reactFlowInstance, isReactFlowReady]);

  // Node positioning utilities
  const getOptimalNodePosition = useCallback(
    (_width = 200, height = 100) => {
      if (!isReactFlowReady) {
        return { x: 100, y: 100 };
      }

      const viewport = reactFlowInstance.getViewport();
      const bounds = getNodesBounds(nodes);

      // If no nodes exist, place at center of viewport
      if (nodes.length === 0) {
        return {
          x: -viewport.x / viewport.zoom + 100,
          y: -viewport.y / viewport.zoom + 100,
        };
      }

      // Place new node to the right of existing nodes
      return {
        x: bounds.x + bounds.width + 100,
        y: bounds.y + bounds.height / 2 - height / 2,
      };
    },
    [reactFlowInstance, nodes, isReactFlowReady],
  );

  const addNodeAtPosition = useCallback(
    (
      nodeData: Omit<CustomWorkflowNode, "id" | "position">,
      position?: { x: number; y: number },
    ) => {
      const nodePosition = position || getOptimalNodePosition();

      addNode({
        ...nodeData,
        position: nodePosition,
      });
    },
    [addNode, getOptimalNodePosition],
  );

  // Layout utilities
  const autoLayout = useCallback(
    (direction: "horizontal" | "vertical" = "horizontal") => {
      const spacing =
        direction === "horizontal" ? { x: 250, y: 150 } : { x: 150, y: 200 };
      let currentX = 0;
      let currentY = 0;

      nodes.forEach((node, index) => {
        if (direction === "horizontal") {
          updateNode(node.id, {
            position: { x: currentX, y: currentY },
          });
          currentX += spacing.x;
          if ((index + 1) % 3 === 0) {
            currentX = 0;
            currentY += spacing.y;
          }
        } else {
          updateNode(node.id, {
            position: { x: currentX, y: currentY },
          });
          currentY += spacing.y;
          if ((index + 1) % 3 === 0) {
            currentY = 0;
            currentX += spacing.x;
          }
        }
      });

      setTimeout(() => fitView({ padding: 50 }), 100);
    },
    [nodes, updateNode, fitView],
  );

  // Export/Import utilities
  const exportWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
      viewport: isReactFlowReady
        ? reactFlowInstance.getViewport()
        : { x: 0, y: 0, zoom: 1 },
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(workflow, null, 2);
  }, [nodes, edges, reactFlowInstance, isReactFlowReady]);

  const downloadWorkflow = useCallback(
    (filename = "workflow.json") => {
      const workflowData = exportWorkflow();
      const blob = new Blob([workflowData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [exportWorkflow],
  );

  // Validation utilities
  const validateWorkflow = useCallback(() => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();

    edges.forEach((edge) => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const disconnectedNodes = nodes.filter(
      (node) => !connectedNodeIds.has(node.id),
    );

    if (disconnectedNodes.length > 0) {
      warnings.push(`${disconnectedNodes.length} disconnected node(s) found`);
    }

    // Check for circular dependencies (basic check)
    const hasCircularDependency = (
      nodeId: string,
      visited = new Set<string>(),
    ): boolean => {
      if (visited.has(nodeId)) return true;
      visited.add(nodeId);

      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

      return outgoingEdges.some((edge) =>
        hasCircularDependency(edge.target, new Set(visited)),
      );
    };

    const nodesWithCircularDeps = nodes.filter((node) =>
      hasCircularDependency(node.id),
    );

    if (nodesWithCircularDeps.length > 0) {
      errors.push("Circular dependencies detected");
    }

    return { errors, warnings, isValid: errors.length === 0 };
  }, [nodes, edges]);

  // Search and filter utilities
  const searchNodes = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase();

      return nodes.filter(
        (node) =>
          node.data.label?.toLowerCase().includes(lowercaseQuery) ||
          node.id.toLowerCase().includes(lowercaseQuery) ||
          node.type?.toLowerCase().includes(lowercaseQuery),
      );
    },
    [nodes],
  );

  const getNodesByType = useCallback(
    (nodeType: string) => {
      return nodes.filter((node) => node.type === nodeType);
    },
    [nodes],
  );

  // Statistics
  const getWorkflowStats = useCallback(() => {
    const nodeTypes = nodes.reduce(
      (acc, node) => {
        const type = node.type || "default";

        acc[type] = (acc[type] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    const edgeTypes = edges.reduce(
      (acc, edge) => {
        const type = edge.type || "default";

        acc[type] = (acc[type] || 0) + 1;

        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      nodeTypes,
      edgeTypes,
      disconnectedNodes:
        nodes.length -
        new Set([...edges.map((e) => e.source), ...edges.map((e) => e.target)])
          .size,
    };
  }, [nodes, edges]);

  return {
    // Viewport utilities
    fitView,
    centerView,
    zoomIn,
    zoomOut,
    resetZoom,

    // Node positioning
    getOptimalNodePosition,
    addNodeAtPosition,

    // Layout
    autoLayout,

    // Export/Import
    exportWorkflow,
    downloadWorkflow,

    // Validation
    validateWorkflow,

    // Search and filter
    searchNodes,
    getNodesByType,

    // Statistics
    getWorkflowStats,

    // ReactFlow instance access
    reactFlowInstance,
  };
};

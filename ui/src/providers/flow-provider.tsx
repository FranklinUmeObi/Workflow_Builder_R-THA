import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

import {
  CustomWorkflowNode,
  ValidationResult,
  ValidationError,
  createDefaultStartNode,
} from "../types/workflow-nodes";

export interface WorkflowEdge extends Edge {
  type?: string;
  label?: string;
}

// Handle click state for easy connections
export interface HandleClickState {
  nodeId: string;
  handleId: string;
  handleType: "source" | "target";
}

export interface WorkflowBuilderContextType {
  // State
  nodes: CustomWorkflowNode[];
  edges: WorkflowEdge[];

  // Core ReactFlow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Connection validation
  isValidConnection: (connection: Connection | WorkflowEdge) => boolean;

  // Node operations
  addNode: (node: Omit<CustomWorkflowNode, "id"> & { id?: string }) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<CustomWorkflowNode>) => void;
  duplicateNode: (nodeId: string) => void;

  // Edge operations
  removeEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => void;

  // Workflow operations
  clearWorkflow: () => void;
  resetWorkflow: () => void;

  // Utility functions
  getNodeById: (nodeId: string) => CustomWorkflowNode | undefined;
  getEdgeById: (edgeId: string) => WorkflowEdge | undefined;
  getConnectedNodes: (nodeId: string) => CustomWorkflowNode[];
  getNodeEdges: (nodeId: string) => WorkflowEdge[];

  // Selection
  selectedNodes: CustomWorkflowNode[];
  selectedEdges: WorkflowEdge[];
  setSelectedNodes: (nodes: CustomWorkflowNode[]) => void;
  setSelectedEdges: (edges: WorkflowEdge[]) => void;
  clearSelection: () => void;

  // Validation
  validationResult: ValidationResult;
  validateWorkflow: () => ValidationResult;

  // Inline editing
  editingNodeId: string | null;
  setEditingNodeId: (nodeId: string | null) => void;
  isNodeEditing: (nodeId: string) => boolean;
  saveNodeChanges: (
    nodeId: string,
    changes: Partial<CustomWorkflowNode>,
  ) => void;

  // Easy connections
  pendingConnection: HandleClickState | null;
  onHandleClick: (
    nodeId: string,
    handleId: string,
    handleType: "source" | "target",
  ) => void;
  clearPendingConnection: () => void;
  isHandleAvailable: (
    nodeId: string,
    handleId: string,
    handleType: "source" | "target",
  ) => boolean;
}

const WorkflowBuilderContext = createContext<WorkflowBuilderContextType | null>(
  null,
);

// Initial data
const initialNodes: CustomWorkflowNode[] = [
  createDefaultStartNode("n1", { x: 100, y: 100 }),
];

const initialEdges: WorkflowEdge[] = [];

interface WorkflowBuilderProviderProps {
  children: ReactNode;
  defaultNodes?: CustomWorkflowNode[];
  defaultEdges?: WorkflowEdge[];
}

export const WorkflowBuilderProvider = ({
  children,
  defaultNodes = initialNodes,
  defaultEdges = initialEdges,
}: WorkflowBuilderProviderProps) => {
  const [nodes, setNodes] = useState<CustomWorkflowNode[]>(defaultNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(defaultEdges);
  const [selectedNodes, setSelectedNodes] = useState<CustomWorkflowNode[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<WorkflowEdge[]>([]);

  // Inline editing state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  // Easy connections state
  const [pendingConnection, setPendingConnection] =
    useState<HandleClickState | null>(null);

  // Validation state
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: [],
  });

  // Helper function to validate workflow
  const performValidation = useCallback(
    (currentNodes: CustomWorkflowNode[], currentEdges: WorkflowEdge[]) => {
      const errors: ValidationError[] = [];

      // Check for exactly one Start node
      const startNodes = currentNodes.filter((node) => node.type === "start");

      if (startNodes.length === 0) {
        errors.push({
          type: "missing-start",
          message: "Workflow must have exactly one Start node",
        });
      } else if (startNodes.length > 1) {
        errors.push({
          type: "multiple-start",
          message: "Workflow can only have one Start node",
        });
      }

      // Check Decision node edge labeling
      const decisionNodes = currentNodes.filter(
        (node) => node.type === "decision",
      );

      decisionNodes.forEach((decisionNode) => {
        const outgoingEdges = currentEdges.filter(
          (edge) => edge.source === decisionNode.id,
        );

        if (outgoingEdges.length === 2) {
          const hasYesLabel = outgoingEdges.some(
            (edge) => edge.label === "yes",
          );
          const hasNoLabel = outgoingEdges.some((edge) => edge.label === "no");

          if (!hasYesLabel || !hasNoLabel) {
            errors.push({
              type: "unlabeled-decision-edges",
              message: `Decision node "${decisionNode.data.label}" must have "yes" and "no" labeled edges when it has two connections`,
              nodeId: decisionNode.id,
            });
          }
        }
      });

      // Check connection rules for proper handle connections
      currentEdges.forEach((edge) => {
        const sourceNode = currentNodes.find((node) => node.id === edge.source);
        const targetNode = currentNodes.find((node) => node.id === edge.target);

        if (!sourceNode || !targetNode) {
          errors.push({
            type: "invalid-connection",
            message: "Edge connects to non-existent node",
            edgeId: edge.id,
          });

          return;
        }

        // Validate connection rules based on node types
        // Start nodes: can only have outgoing connections
        if (sourceNode.type === "start") {
          const outgoingEdges = currentEdges.filter(
            (e) => e.source === sourceNode.id,
          );

          if (outgoingEdges.length > 1) {
            errors.push({
              type: "invalid-connection",
              message: `Start node "${sourceNode.data.label}" can only have one outgoing connection`,
              nodeId: sourceNode.id,
            });
          }
        }

        // End nodes: can only have incoming connections
        if (targetNode.type === "end") {
          const incomingEdges = currentEdges.filter(
            (e) => e.target === targetNode.id,
          );

          if (incomingEdges.length > 1) {
            errors.push({
              type: "invalid-connection",
              message: `End node "${targetNode.data.label}" can only have one incoming connection`,
              nodeId: targetNode.id,
            });
          }
        }

        // Step nodes: can have one incoming and one outgoing connection
        if (sourceNode.type === "step") {
          const outgoingEdges = currentEdges.filter(
            (e) => e.source === sourceNode.id,
          );

          if (outgoingEdges.length > 1) {
            errors.push({
              type: "invalid-connection",
              message: `Step node "${sourceNode.data.label}" can only have one outgoing connection`,
              nodeId: sourceNode.id,
            });
          }
        }

        if (targetNode.type === "step") {
          const incomingEdges = currentEdges.filter(
            (e) => e.target === targetNode.id,
          );

          if (incomingEdges.length > 1) {
            errors.push({
              type: "invalid-connection",
              message: `Step node "${targetNode.data.label}" can only have one incoming connection`,
              nodeId: targetNode.id,
            });
          }
        }

        // Decision nodes: can have one incoming and up to two outgoing connections
        if (sourceNode.type === "decision") {
          const outgoingEdges = currentEdges.filter(
            (e) => e.source === sourceNode.id,
          );

          if (outgoingEdges.length > 2) {
            errors.push({
              type: "invalid-connection",
              message: `Decision node "${sourceNode.data.label}" can only have up to two outgoing connections`,
              nodeId: sourceNode.id,
            });
          }
        }

        if (targetNode.type === "decision") {
          const incomingEdges = currentEdges.filter(
            (e) => e.target === targetNode.id,
          );

          if (incomingEdges.length > 1) {
            errors.push({
              type: "invalid-connection",
              message: `Decision node "${targetNode.data.label}" can only have one incoming connection`,
              nodeId: targetNode.id,
            });
          }
        }
      });

      const result: ValidationResult = {
        isValid: errors.length === 0,
        errors,
      };

      setValidationResult(result);

      return result;
    },
    [],
  );

  // Core ReactFlow handlers
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes(
        (currentNodes) =>
          applyNodeChanges(changes, currentNodes) as CustomWorkflowNode[],
      );
      // Trigger validation after state update
      setTimeout(() => performValidation(nodes, edges), 0);
    },
    [nodes, edges, performValidation],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((currentEdges) => {
        const updatedEdges = applyEdgeChanges(
          changes,
          currentEdges,
        ) as WorkflowEdge[];

        // Trigger validation after edge changes
        setTimeout(() => performValidation(nodes, updatedEdges), 0);

        return updatedEdges;
      });
    },
    [nodes, performValidation],
  );

  // Connection validation function
  const isValidConnection = useCallback(
    (connection: Connection | WorkflowEdge): boolean => {
      // Handle both Connection and WorkflowEdge types
      const sourceId = connection.source;
      const targetId = connection.target;

      const sourceNode = nodes.find((node) => node.id === sourceId);
      const targetNode = nodes.find((node) => node.id === targetId);

      if (!sourceNode || !targetNode) {
        return false;
      }

      // Prevent self-connections
      if (sourceId === targetId) {
        return false;
      }

      // Check if connection already exists
      const existingConnection = edges.find(
        (edge) => edge.source === sourceId && edge.target === targetId,
      );

      if (existingConnection) {
        return false;
      }

      // Validate based on source node type
      switch (sourceNode.type) {
        case "start": {
          // Start nodes can only have one outgoing connection
          const outgoingEdges = edges.filter(
            (edge) => edge.source === sourceNode.id,
          );

          return outgoingEdges.length === 0;
        }
        case "step": {
          // Step nodes can only have one outgoing connection
          const outgoingEdges = edges.filter(
            (edge) => edge.source === sourceNode.id,
          );

          return outgoingEdges.length === 0;
        }
        case "decision": {
          // Decision nodes can have up to two outgoing connections
          const outgoingEdges = edges.filter(
            (edge) => edge.source === sourceNode.id,
          );

          return outgoingEdges.length < 2;
        }
        case "end": {
          // End nodes cannot have outgoing connections
          return false;
        }
        default:
          return false;
      }
    },
    [nodes, edges],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Validate connection before adding
      if (!isValidConnection(connection)) {
        return;
      }

      setEdges((currentEdges) => {
        let newEdge = { ...connection } as WorkflowEdge;

        // Auto-label Decision node edges
        const sourceNode = nodes.find((node) => node.id === connection.source);

        if (sourceNode?.type === "decision") {
          const existingOutgoingEdges = currentEdges.filter(
            (edge) => edge.source === sourceNode.id,
          );

          // If this is the first edge from a decision node, label it "yes"
          // If this is the second edge, label it "no"
          if (existingOutgoingEdges.length === 0) {
            newEdge.label = "yes";
          } else if (existingOutgoingEdges.length === 1) {
            newEdge.label = "no";
          }
        }

        const updatedEdges = addEdge(newEdge, currentEdges) as WorkflowEdge[];

        // Trigger validation after new connection
        setTimeout(() => performValidation(nodes, updatedEdges), 0);

        return updatedEdges;
      });
    },
    [nodes, performValidation, isValidConnection],
  );

  // Node operations
  const addNode = useCallback(
    (nodeData: Omit<CustomWorkflowNode, "id"> & { id?: string }) => {
      const newNode: CustomWorkflowNode = {
        id: nodeData.id || `node-${Date.now()}`,
        ...nodeData,
      } as CustomWorkflowNode;

      const updatedNodes = [...nodes, newNode];

      setNodes(updatedNodes);
      // Trigger validation after state update
      setTimeout(() => performValidation(updatedNodes, edges), 0);
    },
    [nodes, edges, performValidation],
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      const updatedNodes = nodes.filter((node) => node.id !== nodeId);

      setNodes(updatedNodes);
      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );

      // Clear editing state if removing the node being edited
      if (editingNodeId === nodeId) {
        setEditingNodeId(null);
      }

      // Trigger validation after state update
      setTimeout(() => performValidation(updatedNodes, edges), 0);
    },
    [nodes, editingNodeId, edges, performValidation],
  );

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<CustomWorkflowNode>) => {
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node,
      ) as CustomWorkflowNode[];

      setNodes(updatedNodes);
      // Trigger validation after state update
      setTimeout(() => performValidation(updatedNodes, edges), 0);
    },
    [nodes, edges, performValidation],
  );

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);

      if (node) {
        const newNode: CustomWorkflowNode = {
          ...node,
          id: `${node.id}-copy-${Date.now()}`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          selected: false,
        };

        const updatedNodes = [...nodes, newNode];

        setNodes(updatedNodes);
        // Trigger validation after state update
        setTimeout(() => performValidation(updatedNodes, edges), 0);
      }
    },
    [nodes, edges, performValidation],
  );

  // Edge operations
  const removeEdge = useCallback(
    (edgeId: string) => {
      const updatedEdges = edges.filter((edge) => edge.id !== edgeId);

      setEdges(updatedEdges);
      // Trigger validation after removing edge
      setTimeout(() => performValidation(nodes, updatedEdges), 0);
    },
    [nodes, edges, performValidation],
  );

  const updateEdge = useCallback(
    (edgeId: string, updates: Partial<WorkflowEdge>) => {
      const updatedEdges = edges.map((edge) =>
        edge.id === edgeId ? { ...edge, ...updates } : edge,
      );

      setEdges(updatedEdges);
      // Trigger validation after updating edge
      setTimeout(() => performValidation(nodes, updatedEdges), 0);
    },
    [nodes, edges, performValidation],
  );

  // Workflow operations
  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodes([]);
    setSelectedEdges([]);
    setEditingNodeId(null);
    setValidationResult({ isValid: true, errors: [] });
  }, []);

  const resetWorkflow = useCallback(() => {
    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setSelectedNodes([]);
    setSelectedEdges([]);
    setEditingNodeId(null);
    // Trigger validation for default nodes
    setTimeout(() => performValidation(defaultNodes, defaultEdges), 0);
  }, [defaultNodes, defaultEdges, performValidation]);

  // Utility functions
  const getNodeById = useCallback(
    (nodeId: string) => {
      return nodes.find((node) => node.id === nodeId);
    },
    [nodes],
  );

  const getEdgeById = useCallback(
    (edgeId: string) => {
      return edges.find((edge) => edge.id === edgeId);
    },
    [edges],
  );

  const getConnectedNodes = useCallback(
    (nodeId: string) => {
      const connectedNodeIds = new Set<string>();

      edges.forEach((edge) => {
        if (edge.source === nodeId) {
          connectedNodeIds.add(edge.target);
        }
        if (edge.target === nodeId) {
          connectedNodeIds.add(edge.source);
        }
      });

      return nodes.filter((node) => connectedNodeIds.has(node.id));
    },
    [nodes, edges],
  );

  const getNodeEdges = useCallback(
    (nodeId: string) => {
      return edges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId,
      );
    },
    [edges],
  );

  const clearSelection = useCallback(() => {
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, []);

  // Validation logic
  const validateWorkflow = useCallback((): ValidationResult => {
    return performValidation(nodes, edges);
  }, [nodes, edges, performValidation]);

  // Inline editing functions
  const isNodeEditing = useCallback(
    (nodeId: string) => {
      return editingNodeId === nodeId;
    },
    [editingNodeId],
  );

  const saveNodeChanges = useCallback(
    (nodeId: string, changes: Partial<CustomWorkflowNode>) => {
      updateNode(nodeId, changes);
      setEditingNodeId(null);
    },
    [updateNode],
  );

  // Easy connections functions
  const isHandleAvailable = useCallback(
    (nodeId: string, handleId: string, handleType: "source" | "target") => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return false;

      if (handleType === "source") {
        // Check if this source handle already has connections
        const existingConnections = edges.filter(
          (edge) => edge.source === nodeId && edge.sourceHandle === handleId,
        );

        // Different rules based on node type
        switch (node.type) {
          case "start":
          case "step":
            return existingConnections.length === 0; // Only one outgoing connection
          case "decision":
            return existingConnections.length === 0; // Each handle can have one connection
          case "end":
            return false; // End nodes have no output handles
          default:
            return false;
        }
      } else {
        // Target handle
        const existingConnections = edges.filter(
          (edge) => edge.target === nodeId && edge.targetHandle === handleId,
        );

        // All node types except start can have one incoming connection
        switch (node.type) {
          case "start":
            return false; // Start nodes have no input handles
          case "step":
          case "decision":
          case "end":
            return existingConnections.length === 0; // Only one incoming connection
          default:
            return false;
        }
      }
    },
    [nodes, edges],
  );

  const clearPendingConnection = useCallback(() => {
    setPendingConnection(null);
  }, []);

  const onHandleClick = useCallback(
    (nodeId: string, handleId: string, handleType: "source" | "target") => {
      // Check if handle is available
      if (!isHandleAvailable(nodeId, handleId, handleType)) {
        return;
      }

      if (!pendingConnection) {
        // First click - store the handle
        setPendingConnection({ nodeId, handleId, handleType });
      } else {
        // Second click - try to create connection
        const {
          nodeId: sourceNodeId,
          handleId: sourceHandleId,
          handleType: sourceType,
        } = pendingConnection;

        // Validate that we have a source and target
        if (sourceType === "source" && handleType === "target") {
          // Create connection from pending to current
          const connection: Connection = {
            source: sourceNodeId,
            sourceHandle: sourceHandleId,
            target: nodeId,
            targetHandle: handleId,
          };

          if (isValidConnection(connection)) {
            onConnect(connection);
          }
        } else if (sourceType === "target" && handleType === "source") {
          // Create connection from current to pending
          const connection: Connection = {
            source: nodeId,
            sourceHandle: handleId,
            target: sourceNodeId,
            targetHandle: sourceHandleId,
          };

          if (isValidConnection(connection)) {
            onConnect(connection);
          }
        }

        // Clear pending connection after attempt
        setPendingConnection(null);
      }
    },
    [pendingConnection, isHandleAvailable, isValidConnection, onConnect],
  );

  const contextValue: WorkflowBuilderContextType = {
    // State
    nodes,
    edges,

    // Core ReactFlow handlers
    onNodesChange,
    onEdgesChange,
    onConnect,

    // Connection validation
    isValidConnection,

    // Node operations
    addNode,
    removeNode,
    updateNode,
    duplicateNode,

    // Edge operations
    removeEdge,
    updateEdge,

    // Workflow operations
    clearWorkflow,
    resetWorkflow,

    // Utility functions
    getNodeById,
    getEdgeById,
    getConnectedNodes,
    getNodeEdges,

    // Selection
    selectedNodes,
    selectedEdges,
    setSelectedNodes,
    setSelectedEdges,
    clearSelection,

    // Validation
    validationResult,
    validateWorkflow,

    // Inline editing
    editingNodeId,
    setEditingNodeId,
    isNodeEditing,
    saveNodeChanges,

    // Easy connections
    pendingConnection,
    onHandleClick,
    clearPendingConnection,
    isHandleAvailable,
  };

  return (
    <WorkflowBuilderContext.Provider value={contextValue}>
      {children}
    </WorkflowBuilderContext.Provider>
  );
};

// Hook to use the workflow builder context
export const useWorkflowBuilder = () => {
  const context = useContext(WorkflowBuilderContext);

  if (!context) {
    throw new Error(
      "useWorkflowBuilder must be used within a WorkflowBuilderProvider",
    );
  }

  return context;
};

// Additional utility hooks
export const getNewId = () => `node-${Date.now()}`;

export const useWorkflowNodes = () => {
  const { nodes } = useWorkflowBuilder();

  return nodes;
};

export const useWorkflowEdges = () => {
  const { edges } = useWorkflowBuilder();

  return edges;
};

export const useNodeOperations = () => {
  const { addNode, removeNode, updateNode, duplicateNode } =
    useWorkflowBuilder();

  return { addNode, removeNode, updateNode, duplicateNode };
};

export const useEdgeOperations = () => {
  const { removeEdge, updateEdge } = useWorkflowBuilder();

  return { removeEdge, updateEdge };
};

export const useWorkflowSelection = () => {
  const {
    selectedNodes,
    selectedEdges,
    setSelectedNodes,
    setSelectedEdges,
    clearSelection,
  } = useWorkflowBuilder();

  return {
    selectedNodes,
    selectedEdges,
    setSelectedNodes,
    setSelectedEdges,
    clearSelection,
  };
};

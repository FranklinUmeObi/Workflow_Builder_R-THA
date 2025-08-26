import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";

// Types
export interface WorkflowNode extends Node {
  data: {
    label?: string;
    [key: string]: any;
  };
}

export interface WorkflowEdge extends Edge {
  type?: string;
}

export interface WorkflowBuilderContextType {
  // State
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];

  // Core ReactFlow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Node operations
  addNode: (node: Omit<WorkflowNode, "id"> & { id?: string }) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<WorkflowNode>) => void;
  duplicateNode: (nodeId: string) => void;

  // Edge operations
  removeEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<WorkflowEdge>) => void;

  // Workflow operations
  clearWorkflow: () => void;
  resetWorkflow: () => void;

  // Utility functions
  getNodeById: (nodeId: string) => WorkflowNode | undefined;
  getEdgeById: (edgeId: string) => WorkflowEdge | undefined;
  getConnectedNodes: (nodeId: string) => WorkflowNode[];
  getNodeEdges: (nodeId: string) => WorkflowEdge[];

  // Selection
  selectedNodes: WorkflowNode[];
  selectedEdges: WorkflowEdge[];
  setSelectedNodes: (nodes: WorkflowNode[]) => void;
  setSelectedEdges: (edges: WorkflowEdge[]) => void;
  clearSelection: () => void;
}

const WorkflowBuilderContext = createContext<WorkflowBuilderContextType | null>(
  null,
);

// Initial data
const initialNodes: WorkflowNode[] = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    type: "default",
  },
  {
    id: "n2",
    position: { x: 0, y: 100 },
    data: { label: "Node 2" },
    type: "default",
  },
];

const initialEdges: WorkflowEdge[] = [
  { id: "n1-n2", source: "n1", target: "n2", type: "step" },
];

interface WorkflowBuilderProviderProps {
  children: ReactNode;
  defaultNodes?: WorkflowNode[];
  defaultEdges?: WorkflowEdge[];
}

export const WorkflowBuilderProvider = ({
  children,
  defaultNodes = initialNodes,
  defaultEdges = initialEdges,
}: WorkflowBuilderProviderProps) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(defaultNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(defaultEdges);
  const [selectedNodes, setSelectedNodes] = useState<WorkflowNode[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<WorkflowEdge[]>([]);

  // Core ReactFlow handlers
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nodes) => applyNodeChanges(changes, nodes));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((edges) => applyEdgeChanges(changes, edges));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((edges) => addEdge(connection, edges));
  }, []);

  // Node operations
  const addNode = useCallback(
    (nodeData: Omit<WorkflowNode, "id"> & { id?: string }) => {
      const newNode: WorkflowNode = {
        id: nodeData.id || `node-${Date.now()}`,
        ...nodeData,
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [],
  );

  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    );
  }, []);

  const updateNode = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, ...updates } : node,
        ),
      );
    },
    [],
  );

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);

      if (node) {
        const newNode: WorkflowNode = {
          ...node,
          id: `${node.id}-copy-${Date.now()}`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          selected: false,
        };

        setNodes((nds) => [...nds, newNode]);
      }
    },
    [nodes],
  );

  // Edge operations
  const removeEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, []);

  const updateEdge = useCallback(
    (edgeId: string, updates: Partial<WorkflowEdge>) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId ? { ...edge, ...updates } : edge,
        ),
      );
    },
    [],
  );

  // Workflow operations
  const clearWorkflow = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, []);

  const resetWorkflow = useCallback(() => {
    setNodes(defaultNodes);
    setEdges(defaultEdges);
    setSelectedNodes([]);
    setSelectedEdges([]);
  }, [defaultNodes, defaultEdges]);

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

  const contextValue: WorkflowBuilderContextType = {
    // State
    nodes,
    edges,

    // Core ReactFlow handlers
    onNodesChange,
    onEdgesChange,
    onConnect,

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

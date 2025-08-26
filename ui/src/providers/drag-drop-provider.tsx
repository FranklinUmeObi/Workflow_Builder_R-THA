import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  DragEvent,
} from "react";

// Types
export type NodeType = string | null;

export interface NodeData {
  data: { label: string };
  position: { x: number; y: number };
  type: string;
}

export interface DragDropContextType {
  // State
  draggedNodeType: NodeType;
  isDragging: boolean;

  // Actions
  setDraggedNodeType: (type: NodeType) => void;

  // Event handlers
  onDragStart: (event: DragEvent<HTMLElement>, nodeType: string) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

const DragDropContext = createContext<DragDropContextType | null>(null);

interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider = ({ children }: DragDropProviderProps) => {
  const [draggedNodeType, setDraggedNodeType] = useState<NodeType>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(
    (event: DragEvent<HTMLElement>, nodeType: string) => {
      setDraggedNodeType(nodeType);
      setIsDragging(true);
      event.dataTransfer.setData("text/plain", nodeType);
      event.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setDraggedNodeType(null);
  }, []);

  const contextValue: DragDropContextType = {
    draggedNodeType,
    isDragging,
    setDraggedNodeType,
    onDragStart,
    onDragOver,
    onDrop,
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);

  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }

  return context;
};

// Legacy hook for backward compatibility
export const useDnD = (): [NodeType, (type: NodeType) => void] => {
  const { draggedNodeType, setDraggedNodeType } = useDragDrop();

  return [draggedNodeType, setDraggedNodeType];
};

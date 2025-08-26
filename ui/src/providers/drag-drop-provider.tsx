import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  DragEvent,
  useEffect,
  useRef,
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
  dragPosition: { x: number; y: number } | null;
  isOverDropZone: boolean;

  // Actions
  setDraggedNodeType: (type: NodeType) => void;
  setIsOverDropZone: (isOver: boolean) => void;

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
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const dragPreviewRef = useRef<HTMLDivElement>(null);

  // Track mouse position during drag
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        setDragPosition({ x: event.clientX, y: event.clientY });
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      setDraggedNodeType(null);
      setDragPosition(null);
      setIsOverDropZone(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("dragend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, [isDragging]);

  const onDragStart = useCallback(
    (event: DragEvent<HTMLElement>, nodeType: string) => {
      setDraggedNodeType(nodeType);
      setIsDragging(true);
      setDragPosition({ x: event.clientX, y: event.clientY });
      event.dataTransfer.setData("text/plain", nodeType);
      event.dataTransfer.effectAllowed = "move";

      // Create a transparent drag image to hide the default browser drag preview
      const dragImage = new Image();

      dragImage.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
      event.dataTransfer.setDragImage(dragImage, 0, 0);
    },
    [],
  );

  const onDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setIsOverDropZone(true);
  }, []);

  const onDrop = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    setDraggedNodeType(null);
    setDragPosition(null);
    setIsOverDropZone(false);
  }, []);

  const contextValue: DragDropContextType = {
    draggedNodeType,
    isDragging,
    dragPosition,
    isOverDropZone,
    setDraggedNodeType,
    setIsOverDropZone,
    onDragStart,
    onDragOver,
    onDrop,
  };

  // Render drag preview component
  const renderDragPreview = () => {
    if (!isDragging || !draggedNodeType || !dragPosition) return null;

    const getPreviewContent = () => {
      switch (draggedNodeType) {
        case "start":
          return (
            <div className="node-preview start-preview">
              <div className="node-type-label">START</div>
              <div className="node-name">Start Node</div>
              <div className="handle-preview bottom" />
            </div>
          );
        case "step":
          return (
            <div className="node-preview step-preview">
              <div className="handle-preview top" />
              <div className="node-type-label">STEP</div>
              <div className="node-name">Step Node</div>
              <div className="handle-preview bottom" />
            </div>
          );
        case "decision":
          return (
            <div className="node-preview decision-preview">
              <div className="handle-preview top" />
              <div className="node-type-label">DECISION</div>
              <div className="node-name">Decision Node</div>
              <div className="handle-preview bottom-left" />
              <div className="handle-preview bottom-right" />
            </div>
          );
        case "end":
          return (
            <div className="node-preview end-preview">
              <div className="handle-preview top" />
              <div className="node-type-label">END</div>
              <div className="node-name">End Node</div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={dragPreviewRef}
        className="drag-preview"
        style={{
          position: "fixed",
          left: dragPosition.x + 10,
          top: dragPosition.y + 10,
          pointerEvents: "none",
          zIndex: 1000,
          transform: "scale(0.8)",
          opacity: 0.8,
        }}
      >
        {getPreviewContent()}
      </div>
    );
  };

  return (
    <DragDropContext.Provider value={contextValue}>
      {children}
      {renderDragPreview()}
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

import { useDragDrop } from "@/providers/drag-drop-provider";

export const Palette = () => {
  const { onDragStart } = useDragDrop();

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        draggable
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
      >
        Input Node
      </div>
      <div
        draggable
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
      >
        Default Node
      </div>
      <div
        draggable
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
      >
        Output Node
      </div>
    </aside>
  );
};

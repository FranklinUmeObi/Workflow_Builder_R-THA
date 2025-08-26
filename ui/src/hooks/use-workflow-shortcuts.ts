import { useEffect, useCallback } from "react";

import { useWorkflowBuilder } from "@/providers/flow-provider";

interface UseWorkflowShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useWorkflowShortcuts = (
  options: UseWorkflowShortcutsOptions = {},
) => {
  const { enabled = true, preventDefault = true } = options;

  const {
    selectedNodes,
    selectedEdges,
    removeNode,
    removeEdge,
    duplicateNode,
    clearSelection,
    clearWorkflow,
    resetWorkflow,
  } = useWorkflowBuilder();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      // Prevent default behavior for handled shortcuts
      const shouldPreventDefault = () => {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
      };

      // Delete selected nodes/edges
      if (key === "Delete" || key === "Backspace") {
        shouldPreventDefault();
        selectedNodes.forEach((node) => removeNode(node.id));
        selectedEdges.forEach((edge) => removeEdge(edge.id));

        return;
      }

      // Escape - clear selection
      if (key === "Escape") {
        shouldPreventDefault();
        clearSelection();

        return;
      }

      // Ctrl/Cmd shortcuts
      if (isModifierPressed) {
        switch (key.toLowerCase()) {
          case "a":
            // Select all (handled by ReactFlow by default)
            break;

          case "c":
            // Copy (could be implemented with clipboard API)
            shouldPreventDefault();
            // TODO: Implement copy functionality
            break;

          case "v":
            // Paste (could be implemented with clipboard API)
            shouldPreventDefault();
            // TODO: Implement paste functionality
            break;

          case "d":
            // Duplicate selected nodes
            shouldPreventDefault();
            selectedNodes.forEach((node) => duplicateNode(node.id));
            break;

          case "z":
            // Undo/Redo (would need undo/redo system)
            shouldPreventDefault();
            if (shiftKey) {
              // TODO: Implement redo
            } else {
              // TODO: Implement undo
            }
            break;

          case "s":
            // Save/Download workflow
            shouldPreventDefault();
            // TODO: downloadWorkflow();
            break;

          case "n":
            // New workflow
            shouldPreventDefault();
            if (shiftKey) {
              resetWorkflow();
            } else {
              clearWorkflow();
            }
            break;

          case "f":
            // Fit view
            shouldPreventDefault();
            // TODO: fitView();
            break;

          case "l":
            // Auto layout
            shouldPreventDefault();
            // TODO: autoLayout(shiftKey ? "vertical" : "horizontal");
            break;

          case "=":
          case "+":
            // Zoom in
            shouldPreventDefault();
            // TODO: zoomIn();
            break;

          case "-":
            // Zoom out
            shouldPreventDefault();
            // TODO: zoomOut();
            break;

          case "0":
            // Reset zoom
            shouldPreventDefault();
            // TODO: resetZoom();
            break;
        }
      }

      // Alt shortcuts
      if (altKey) {
        switch (key.toLowerCase()) {
          case "h":
            // Auto layout horizontal
            shouldPreventDefault();
            // TODO: autoLayout("horizontal");
            break;

          case "v":
            // Auto layout vertical
            shouldPreventDefault();
            // TODO: autoLayout("vertical");

            break;
        }
      }
    },
    [
      enabled,
      preventDefault,
      selectedNodes,
      selectedEdges,
      removeNode,
      removeEdge,
      duplicateNode,
      clearSelection,
      clearWorkflow,
      resetWorkflow,
    ],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleKeyDown]);

  // Return available shortcuts for documentation/help
  const shortcuts = {
    delete: "Delete/Backspace - Delete selected nodes/edges",
    escape: "Escape - Clear selection",
    duplicate: "Ctrl+D - Duplicate selected nodes",
    save: "Ctrl+S - Download workflow",
    newWorkflow: "Ctrl+N - Clear workflow, Ctrl+Shift+N - Reset workflow",
    fitView: "Ctrl+F - Fit view to content",
    autoLayout:
      "Ctrl+L - Auto layout horizontal, Ctrl+Shift+L - Auto layout vertical",
    zoom: "Ctrl+Plus - Zoom in, Ctrl+Minus - Zoom out, Ctrl+0 - Reset zoom",
    altLayout: "Alt+H - Horizontal layout, Alt+V - Vertical layout",
  };

  return {
    shortcuts,
    enabled,
  };
};

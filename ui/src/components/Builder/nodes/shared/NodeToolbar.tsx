import React from "react";
import { NodeToolbar, Position } from "@xyflow/react";
import { Button } from "@heroui/button";

interface NodeToolbarProps {
  isVisible?: boolean;
  position?: Position;
  onDuplicate: () => void;
  onDelete: () => void;
  onDetach: () => void;
}

// Icons for the toolbar buttons
const DuplicateIcon = ({ size = 14 }) => (
  <svg
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <rect height="13" rx="2" ry="2" width="13" x="9" y="9" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const DeleteIcon = ({ size = 14 }) => (
  <svg
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const DetachIcon = ({ size = 14 }) => (
  <svg
    fill="none"
    height={size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07a5.006 5.006 0 0 0-7.07-.12l-1.71 1.72" />
    <path d="M5.17 11.75l-1.72 1.71v.02a5.004 5.004 0 0 0 .12 7.07a5.006 5.006 0 0 0 7.07.12l1.71-1.72" />
    <line x1="8" x2="8" y1="2" y2="5" />
    <line x1="2" x2="5" y1="8" y2="8" />
    <line x1="16" x2="16" y1="19" y2="22" />
    <line x1="19" x2="22" y1="16" y2="16" />
  </svg>
);

export const CustomNodeToolbar: React.FC<NodeToolbarProps> = ({
  isVisible,
  position = Position.Bottom,
  onDuplicate,
  onDelete,
  onDetach,
}) => {
  return (
    <NodeToolbar isVisible={isVisible} position={position}>
      <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-md shadow-lg">
        <Button
          className="min-w-unit-8 w-unit-8 h-unit-8 p-0"
          color="default"
          size="sm"
          title="Duplicate node"
          variant="flat"
          onPress={onDuplicate}
        >
          <DuplicateIcon />
        </Button>

        <Button
          className="min-w-unit-8 w-unit-8 h-unit-8 p-0"
          color="warning"
          size="sm"
          title="Detach all connections"
          variant="flat"
          onPress={onDetach}
        >
          <DetachIcon />
        </Button>

        <Button
          className="min-w-unit-8 w-unit-8 h-unit-8 p-0"
          color="danger"
          size="sm"
          title="Delete node"
          variant="flat"
          onPress={onDelete}
        >
          <DeleteIcon />
        </Button>
      </div>
    </NodeToolbar>
  );
};

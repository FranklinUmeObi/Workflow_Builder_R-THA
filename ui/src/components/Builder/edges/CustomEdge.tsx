import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "@xyflow/react";

export const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className={`nodrag nopan ${
              label === "yes"
                ? "bg-green-50 text-green-700 border border-green-200"
                : label === "no"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-white text-gray-700 border border-gray-200"
            } px-2 py-1 rounded shadow-sm`}
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              fontWeight: 600,
              pointerEvents: "all",
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

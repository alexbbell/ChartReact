import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';

export type CustomEdgeData = {
  label?: string;
};

type CustomEdgeType = Edge<CustomEdgeData, 'custom'>;

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: EdgeProps<CustomEdgeType>) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
    offset: 20,
  });

  const hasLabel = !!data?.label;

  // Default: place label near target
  let labelX = targetX + 30;
  let labelY = targetY - 5;

  // If edge goes too close to the left side, move label to the right
  if (labelX < 40) {
    labelX = targetX + 26;
  }

  // If edge is too close to the top, move label below
  if (labelY < 20) {
    labelY = targetY + 18;
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />

      {hasLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              fontSize: 12,
              fontWeight: 600,
              color: '#f00',
              background: 'transparent',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            {data!.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type Edge,
  type EdgeProps,
} from '@xyflow/react';

type CustomEdgeData = {
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

  const factor = 0.88;
  const labelX = sourceX + (targetX - sourceX) * factor - 20;
  // const labelY = sourceY + (targetY - sourceY) * factor;
  const labelY = targetY - 5;

  return (
    <>
      <BaseEdge id={id} path={edgePath} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            fontSize: 12,
            fontWeight: 600,
            background: '#fff',
            color: '#f00',
            padding: '2px 6px',
            borderRadius: 999,
            whiteSpace: 'nowrap',
            pointerEvents: 'all',
          }}
        >
          {data?.label ?? ''}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
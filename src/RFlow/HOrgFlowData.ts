import {
  type Node,
  type Edge,
  MarkerType,
  Position,
} from '@xyflow/react';
import type {
  ICompanyListItem,
  ICompanyRelation
} from './RFlowData';

export type TVuau = 'VU' | 'AU' | 'BU' | 'GU';

export type HOrgNodeData = {
  title: string;
  grundKapital: number;
  stammKapital: number;
  colorScheme: number;
  location?: string;
  vuau?: TVuau;
};

export type HOrgFlowNode = Node<HOrgNodeData, 'custom'>;

const NODE_WIDTH = 350;
const NODE_HEIGHT = 82;

const ROOT_HORIZONTAL_GAP = 140;
const LEVEL1_HORIZONTAL_GAP = 80;
const FIRST_CHILD_TOP_GAP = 110;
const VERTICAL_GAP = 40;
const MULTI_PARENT_OFFSET_X = 40;

const RECT_PADDING_X = 24;
const RECT_PADDING_Y = 20;
const RESOLVE_STEP_Y = NODE_HEIGHT + VERTICAL_GAP;
const MAX_RESOLVE_ITERATIONS = 2000;

const getNodeId = (id: number): string => `n${id}`;

const safeNumber = (value: unknown, fallback = 0): number => {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
};

const mapVuau = (value?: string): TVuau | undefined => {
  if (value === 'VU' || value === 'AU' || value === 'BU' || value === 'GU') {
    return value;
  }
  return undefined;
};

const buildLocation = (item: ICompanyListItem): string => {
  const vuau = mapVuau(item.CSAUVU);
  return [item.CSLocation, vuau].filter(Boolean).join(' | ');
};

type TRect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const getNodeRect = (node: HOrgFlowNode): TRect => ({
  left: node.position.x,
  right: node.position.x + NODE_WIDTH,
  top: node.position.y,
  bottom: node.position.y + NODE_HEIGHT,
});


const intersects = (a: TRect, b: TRect): boolean => {
  return !(
    a.right + RECT_PADDING_X <= b.left ||
    b.right + RECT_PADDING_X <= a.left ||
    a.bottom + RECT_PADDING_Y <= b.top ||
    b.bottom + RECT_PADDING_Y <= a.top
  );
};

const resolveNodeOverlaps = (nodes: HOrgFlowNode[]): HOrgFlowNode[] => {
  const result = nodes.map((n) => ({
    ...n,
    position: { ...n.position },
  }));

  let changed = true;
  let iterations = 0;

  while (changed && iterations < MAX_RESOLVE_ITERATIONS) {
    changed = false;
    iterations++;

    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = result[i];
        const b = result[j];

        const rectA = getNodeRect(a);
        const rectB = getNodeRect(b);

        if (intersects(rectA, rectB)) {
          // keep roots more stable, prefer moving the lower/right node
          const moveTarget =
            b.position.y >= a.position.y ? b : a;

          moveTarget.position.y += RESOLVE_STEP_Y;
          changed = true;
        }
      }
    }
  }

  return result;
};

const createNodeFromItem = (
  item: ICompanyListItem,
  x: number,
  y: number
): HOrgFlowNode => ({
  id: getNodeId(item.Id),
  type: 'custom',
  position: { x, y },
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
  data: {
    title: item.Title ?? '',
    grundKapital: safeNumber(item.CSGrundKapital, 0),
    stammKapital: safeNumber(item.CSStammKapital, 0),
    colorScheme: safeNumber(item.CSColorScheme, 0),
    location: buildLocation(item),
    vuau: mapVuau(item.CSAUVU),
  },
  style: {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  },
});

const normalizeStructure = (items: ICompanyListItem[]): {
  companies: ICompanyListItem[];
  relations: ICompanyRelation[];
} => {
  const companyMap = new Map<number, ICompanyListItem>();
  const relations: ICompanyRelation[] = [];

  items.forEach((item) => {
    if (!companyMap.has(item.Id)) {
      companyMap.set(item.Id, item);
    }

    if (item.CSParent?.Id) {
      relations.push({
        parentId: item.CSParent.Id,
        childId: item.Id,
        share: item.CSTeil,
      });
    }
  });

  return {
    companies: Array.from(companyMap.values()),
    relations,
  };
};




export const buildHOrgNodes = (items: ICompanyListItem[]): HOrgFlowNode[] => {
  const { companies, relations } = normalizeStructure(items);

  const companyMap = new Map<number, ICompanyListItem>(
    companies.map((c) => [c.Id, c])
  );

  const nodeMap = new Map<number, HOrgFlowNode>();
  const parentChildren = new Map<number, number[]>();
  const parentsByChild = new Map<number, number[]>();

  relations.forEach((r) => {
    if (!parentChildren.has(r.parentId)) {
      parentChildren.set(r.parentId, []);
    }
    parentChildren.get(r.parentId)!.push(r.childId);

    if (!parentsByChild.has(r.childId)) {
      parentsByChild.set(r.childId, []);
    }
    parentsByChild.get(r.childId)!.push(r.parentId);
  });

  const roots = companies
    .filter((c) => !parentsByChild.has(c.Id))
    .sort((a, b) => (a.Title ?? '').localeCompare(b.Title ?? ''));

  parentChildren.forEach((childIds, parentId) => {
    childIds.sort((a, b) => {
      const ca = companyMap.get(a)?.Title ?? '';
      const cb = companyMap.get(b)?.Title ?? '';
      return ca.localeCompare(cb);
    });

    parentChildren.set(parentId, Array.from(new Set(childIds)));
  });

  const nodes: HOrgFlowNode[] = [];

  const placeNode = (
    companyId: number,
    x: number,
    y: number,
    depth: number
  ): number => {
    if (nodeMap.has(companyId)) {
      return NODE_HEIGHT;
    }

    const item = companyMap.get(companyId);
    if (!item) {
      return NODE_HEIGHT;
    }

    const finalX =
      typeof item.CSCoordX === 'number' && depth === 0 ? item.CSCoordX : x;
    const finalY =
      typeof item.CSCoordY === 'number' && depth === 0 ? item.CSCoordY : y;

    const node = createNodeFromItem(item, finalX, finalY);
    nodes.push(node);
    nodeMap.set(companyId, node);

    const children = parentChildren.get(companyId) ?? [];
    if (children.length === 0) {
      return NODE_HEIGHT;
    }

    if (depth === 0) {
      let currentX = finalX;
      let maxBottom = finalY + NODE_HEIGHT;

      children.forEach((childId) => {
        const parentCount = parentsByChild.get(childId)?.length ?? 1;
        const childX = currentX + (parentCount > 1 ? MULTI_PARENT_OFFSET_X : 0);
        const childY = finalY + FIRST_CHILD_TOP_GAP;

        const childHeight = placeNode(childId, childX, childY, depth + 1);

        maxBottom = Math.max(maxBottom, childY + childHeight);
        currentX += NODE_WIDTH + LEVEL1_HORIZONTAL_GAP;
      });

      return maxBottom - finalY;
    }

    let currentY = finalY + FIRST_CHILD_TOP_GAP;
    let maxBottom = finalY + NODE_HEIGHT;

    children.forEach((childId) => {
      const parentCount = parentsByChild.get(childId)?.length ?? 1;
      const childX = finalX + (parentCount > 1 ? MULTI_PARENT_OFFSET_X : 0);

      const childHeight = placeNode(childId, childX, currentY, depth + 1);

      maxBottom = Math.max(maxBottom, currentY + childHeight);
      currentY += childHeight + VERTICAL_GAP;
    });

    return maxBottom - finalY;
  };

  let currentRootX = 0;

  roots.forEach((root) => {
    const x = typeof root.CSCoordX === 'number' ? root.CSCoordX : currentRootX;
    const y = typeof root.CSCoordY === 'number' ? root.CSCoordY : 0;

    placeNode(root.Id, x, y, 0);

    if (typeof root.CSCoordX !== 'number') {
      currentRootX += NODE_WIDTH + ROOT_HORIZONTAL_GAP;
    } else {
      currentRootX = Math.max(
        currentRootX,
        root.CSCoordX + NODE_WIDTH + ROOT_HORIZONTAL_GAP
      );
    }
  });

  companies.forEach((company) => {
    if (!nodeMap.has(company.Id)) {
      const fallbackNode = createNodeFromItem(company, currentRootX, 0);
      nodes.push(fallbackNode);
      nodeMap.set(company.Id, fallbackNode);
      currentRootX += NODE_WIDTH + ROOT_HORIZONTAL_GAP;
    }
  });

  return resolveNodeOverlaps(nodes);
};


export const buildHOrgEdges = (items: ICompanyListItem[]): Edge[] => {
  const { relations } = normalizeStructure(items);

  return relations.map((r, index) => ({
    id: `e${index}`,
    source: getNodeId(r.parentId),
    target: getNodeId(r.childId),
    type: 'smoothstep',
    label: r.share !== null ? `${r.share}%` : undefined,
    markerEnd: {
      type: MarkerType.Arrow,
    },
    style: {
      strokeWidth: 1.5,
    },
    labelStyle: {
      fontSize: 14,
      fontWeight: 600,
    },
  }));
};

export const buildHOrgFlow = (
  items: ICompanyListItem[]
): { nodes: HOrgFlowNode[]; edges: Edge[] } => {
  return {
    nodes: buildHOrgNodes(items),
    edges: buildHOrgEdges(items),
  };
};
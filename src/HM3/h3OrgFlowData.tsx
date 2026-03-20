import { Position, MarkerType, type Node, type Edge } from '@xyflow/react';
import type { IOrgCompany, IRelation } from './hm3int';

export type H3OrgNodeData = {
  title: string;
  kapital: string;
  city: string;
  participationType: string;
  logo: string;
  url: string;
  // location: string;
  hasParent?: boolean;
  hasChild?: boolean;
};

export type HOrgFlowNode = Node<H3OrgNodeData, 'custom'>;
export type HOrgFlowEdgeData = {
  label?: string;
};
export type HOrgFlowEdge = Edge<HOrgFlowEdgeData, 'custom'>;

const NODE_WIDTH = 350;
const NODE_HEIGHT = 82;

const ROOT_START_X = 80;
const ROOT_START_Y = 40;

const LEVEL_OFFSET_X = 50;      // небольшой горизонтальный offset для вложенности
const LEVEL_OFFSET_Y = 110;     // расстояние между уровнями вниз
const SIBLING_GAP_Y = 36;       // расстояние между соседними элементами

const ROOT_GAP_X = 260;         // расстояние между отдельными root-деревьями

const RECT_PADDING_X = 24;
const RECT_PADDING_Y = 20;
const RESOLVE_STEP_Y = NODE_HEIGHT + SIBLING_GAP_Y;
const MAX_RESOLVE_ITERATIONS = 2000;

const getNodeId = (id: number): string => `n${id}`;

const safeNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim();
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  return fallback;
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
          const moveTarget = b.position.y >= a.position.y ? b : a;
          moveTarget.position.y += RESOLVE_STEP_Y;
          changed = true;
        }
      }
    }
  }

  return result;
};

const createNodeFromItem = (
  item: IOrgCompany,
  x: number,
  y: number,
  hasParent: boolean,
  hasChild: boolean
): HOrgFlowNode => ({
  id: getNodeId(item.Id),
  type: 'custom',
  position: { x, y },
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,

  /// Mapping fields
  data: {
    title: item.Title ?? '',
    kapital: item.Value ?? '',
    city: item.City ?? '',
    participationType: item.ParticipationType ?? '',
    url: item.LinkUrl?.Url ?? '',
    logo: item.Logo??'',
    hasParent,
    hasChild,
  },
  style: {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  },
});

export const h3buildHOrgFlow = (
  spCompanies: IOrgCompany[],
  relations: IRelation[]
): HOrgFlowNode[] => {
  const companyMap = new Map<number, IOrgCompany>(
    spCompanies.map((c) => [c.Id, c])
  );

  const nodeMap = new Map<number, HOrgFlowNode>();
  const parentChildren = new Map<number, IRelation[]>();
  const parentsByChild = new Map<number, number[]>();

  relations.forEach((r) => {
    if (!parentChildren.has(r.Parent)) {
      parentChildren.set(r.Parent, []);
    }
    parentChildren.get(r.Parent)!.push(r);

    if (!parentsByChild.has(r.Child)) {
      parentsByChild.set(r.Child, []);
    }
    parentsByChild.get(r.Child)!.push(r.Parent);
  });

  // Сортировка children:
  // 1. по Share/CSTeil/Share desc
  // 2. затем по Title asc
  parentChildren.forEach((childRelations, parentId) => {
    const uniqueByChild = new Map<number, IRelation>();

    childRelations.forEach((rel) => {
      const existing = uniqueByChild.get(rel.Child);
      if (!existing || safeNumber(rel.Share, 0) > safeNumber(existing.Share, 0)) {
        uniqueByChild.set(rel.Child, rel);
      }
    });

    const sorted = Array.from(uniqueByChild.values()).sort((a, b) => {
      const shareDiff = safeNumber(b.Share, 0) - safeNumber(a.Share, 0);
      if (shareDiff !== 0) {
        return shareDiff;
      }

      const titleA = companyMap.get(a.Child)?.Title ?? '';
      const titleB = companyMap.get(b.Child)?.Title ?? '';
      return titleA.localeCompare(titleB);
    });

    parentChildren.set(parentId, sorted);
  });

  const roots = spCompanies
    .filter((c) => !parentsByChild.has(c.Id))
    .sort((a, b) => (a.Title ?? '').localeCompare(b.Title ?? ''));

  const nodes: HOrgFlowNode[] = [];

  const placeNode = (
    companyId: number,
    x: number,
    y: number,
    level: number
  ): number => {
    if (nodeMap.has(companyId)) {
      return y + NODE_HEIGHT;
    }

    const item = companyMap.get(companyId);
    if (!item) {
      return y;
    }

    const hasParent = parentsByChild.has(companyId);
    const childRelations = parentChildren.get(companyId) ?? [];
    const hasChild = childRelations.length > 0;

    const node = createNodeFromItem(item, x, y, hasParent, hasChild);
    nodes.push(node);
    nodeMap.set(companyId, node);

    if (!hasChild) {
      return y + NODE_HEIGHT;
    }

    let subtreeBottom = y + NODE_HEIGHT;
    let currentChildY = y + LEVEL_OFFSET_Y;

    for (const relation of childRelations) {
      const childId = relation.Child;

      // чуть вправо на каждом уровне
      const childX = x - LEVEL_OFFSET_X;

      const childBottom = placeNode(
        childId,
        childX,
        currentChildY,
        level + 1
      );

      subtreeBottom = Math.max(subtreeBottom, childBottom);
      currentChildY = childBottom + SIBLING_GAP_Y;
    }

    return subtreeBottom;
  };

  let currentRootX = ROOT_START_X;

  for (const root of roots) {
    void placeNode(root.Id, currentRootX, ROOT_START_Y, 0);
    // следующий root чуть правее, чтобы деревья не накладывались
    currentRootX += NODE_WIDTH + ROOT_GAP_X;
  }

  // fallback для orphan/cycle/isolated nodes
  for (const company of spCompanies) {
    if (!nodeMap.has(company.Id)) {
      const hasParent = parentsByChild.has(company.Id);
      const hasChild = (parentChildren.get(company.Id)?.length ?? 0) > 0;

      const fallbackNode = createNodeFromItem(
        company,
        currentRootX,
        ROOT_START_Y,
        hasParent,
        hasChild
      );

      nodes.push(fallbackNode);
      nodeMap.set(company.Id, fallbackNode);

      currentRootX += NODE_WIDTH + ROOT_GAP_X;
    }
  }

  return resolveNodeOverlaps(nodes);
};

const getEdgeId = (parentId: number, childId: number, relationId?: number): string =>
  relationId != null ? `e${relationId}` : `e${parentId}-${childId}`;

const formatShareLabel = (share: unknown): string | undefined => {
  const value = safeNumber(share, NaN);

  if (Number.isNaN(value)) {
    return undefined;
  }

  return `${value}%`;
};

export const h3buildHOrgEdges = (
  relations: IRelation[],
  companies?: IOrgCompany[]
): HOrgFlowEdge[] => {
  const companyIds = companies ? new Set(companies.map((c) => c.Id)) : null;

  return relations
    .filter((relation) => {
      if (!companyIds) {
        return true;
      }
      return companyIds.has(relation.Parent) && companyIds.has(relation.Child);
    })
    .map((relation) => ({
      id: getEdgeId(relation.Parent, relation.Child, relation.Id),
      type: 'custom',
      source: getNodeId(relation.Parent),
      target: getNodeId(relation.Child),
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      data: {
        label: formatShareLabel(relation.Share),
      },
    }));
};
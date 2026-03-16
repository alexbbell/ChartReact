import { Position } from "@xyflow/react";
import type { HOrgFlowNode } from "./HOrgFlowData";
import type { ICompanyListItem, TVuau } from "./RFlowData";

const getNodeId = (id: number): string => `n${id}`;

const safeNumber = (value: unknown, fallback = 0): number => {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
};

const NODE_WIDTH = 350;
const NODE_HEIGHT = 82;
// const VERTICAL_GAP = 40;

// const ROOT_HORIZONTAL_GAP = 140;
// const LEVEL1_HORIZONTAL_GAP = 80;
// const FIRST_CHILD_TOP_GAP = 110;
// const MULTI_PARENT_OFFSET_X = 40;

// const RECT_PADDING_X = 24;
// const RECT_PADDING_Y = 20;
// const RESOLVE_STEP_Y = NODE_HEIGHT + VERTICAL_GAP;
// const MAX_RESOLVE_ITERATIONS = 2000;

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

export const createNodeFromItem = (  item: ICompanyListItem,   x: number,   y: number ): HOrgFlowNode => ({
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



export const companiesToNodes = ( companies: ICompanyListItem[]): HOrgFlowNode[] => {
  return companies.map((company) =>
    createNodeFromItem(
      company,
      company.CSCoordX ?? 0,
      company.CSCoordY ?? 0
    )
  );
};


export const companiesToHRNodes = ( companies: ICompanyListItem[]): HOrgFlowNode[] => {
  return companies.map((company) =>
    createNodeFromItem(
      company,
      company.CSCoordX ?? 0,
      company.CSCoordY ?? 0
    )
  );
};
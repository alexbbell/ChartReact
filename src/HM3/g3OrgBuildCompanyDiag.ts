import { h3buildHOrgEdges, h3buildHOrgFlow, type HOrgFlowEdge, type HOrgFlowNode } from "./h3OrgFlowData";
import type { IOrgCompany, IRelation } from "./hm3int";

export const h3buildCompanyDiagram = (
  spCompanies: IOrgCompany[],
  relations: IRelation[]
): {
  nodes: HOrgFlowNode[];
  edges: HOrgFlowEdge[];
} => {
  const nodes = h3buildHOrgFlow(spCompanies, relations);
  const edges = h3buildHOrgEdges(relations, spCompanies);

  return {
    nodes,
    edges,
  };
};
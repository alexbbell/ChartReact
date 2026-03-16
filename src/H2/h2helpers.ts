import type { ICompanyListItem, ICompanyRelation } from "../RFlow/RFlowData";

export const normalizeStructure = (items: ICompanyListItem[]): {
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


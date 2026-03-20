import { spdata } from "./data";
import type { IOrgCompany, IRelation } from "./hm3int";



export const spCompanies:IOrgCompany[] = spdata

export const relations: IRelation[] = [
  { Id: 1, Parent: 1, Child: 25, Share: 100 },
  { Id: 2, Parent: 2, Child: 5, Share: 20 },
  { Id: 3, Parent: 25, Child: 5, Share: 80 },
  { Id: 4, Parent: 25, Child: 39, Share: 74 },
  { Id: 5, Parent: 1, Child: 39, Share: 25.8 },
  { Id: 6, Parent: 3, Child: 39, Share: 0.1 },
  { Id: 7, Parent: 5, Child: 6, Share: 100 },
  { Id: 8, Parent: 5, Child: 7, Share: 100 },
  { Id: 9, Parent: 5, Child: 8, Share: 100 },
  { Id: 10, Parent: 5, Child: 10, Share: 100 },
  { Id: 11, Parent: 10, Child: 11, Share: 50 },
  { Id: 12, Parent: 10, Child: 12, Share: 7.98 },
  { Id: 13, Parent: 10, Child: 13, Share: 7.98 },
  { Id: 14, Parent: 5, Child: 14, Share: 51 },
  { Id: 15, Parent: 5, Child: 15, Share: 50 },
  { Id: 16, Parent: 5, Child: 16, Share: 50 },
  { Id: 17, Parent: 5, Child: 17, Share: 51 },
  { Id: 18, Parent: 25, Child: 19, Share: 29.9 },
  { Id: 19, Parent: 5, Child: 20, Share: 19 },
  { Id: 20, Parent: 5, Child: 21, Share: 19 },
  { Id: 21, Parent: 25, Child: 26, Share: 100 },
  { Id: 22, Parent: 25, Child: 27, Share: 100 },
  { Id: 23, Parent: 25, Child: 28, Share: 100 },
  { Id: 24, Parent: 28, Child: 30, Share: 100 },
  { Id: 25, Parent: 25, Child: 31, Share: 50 },
  { Id: 26, Parent: 25, Child: 32, Share: 33 },
  { Id: 27, Parent: 25, Child: 33, Share: 25 },
  { Id: 28, Parent: 25, Child: 34, Share: 25 },
  { Id: 29, Parent: 25, Child: 36, Share: 50 },
  { Id: 30, Parent: 25, Child: 37, Share: 50 },
  { Id: 31, Parent: 25, Child: 38, Share: 88.9 },
  { Id: 32, Parent: 4, Child: 39, Share: 0.1 },
  { Id: 33, Parent: 5, Child: 23, Share: 13 },
  { Id: 34, Parent: 5, Child: 24, Share: 15 },
  { Id: 35, Parent: 8, Child: 43, Share: 100 },
  { Id: 36, Parent: 39, Child: 42, Share: 0.38 },
  { Id: 37, Parent: 5, Child: 48, Share: 15 },
  { Id: 38, Parent: 25, Child: 45, Share: 6.25 },
  { Id: 39, Parent: 8, Child: 51, Share: 49.9 },
  { Id: 40, Parent: 10, Child: 55, Share: 100 },
  { Id: 41, Parent: 30, Child: 50, Share: 100 },
  { Id: 42, Parent: 39, Child: 42, Share: 41 },
  { Id: 43, Parent: 39, Child: 60, Share: 2.23 },
  { Id: 44, Parent: 10, Child: 52, Share: 40 },
  { Id: 45, Parent: 10, Child: 53, Share: 40 },
  { Id: 46, Parent: 10, Child: 54, Share: 40 },
  { Id: 47, Parent: 25, Child: 65, Share: 25 },
  { Id: 48, Parent: 5, Child: 66, Share: 50 },
  { Id: 49, Parent: 25, Child: 67, Share: 100 },
  { Id: 50, Parent: 25, Child: 68, Share: 100 },
  { Id: 51, Parent: 8, Child: 70, Share: 100 },
  { Id: 52, Parent: 7, Child: 69, Share: 50 },
];

export const sortedRelations = [...relations].sort((a, b) => a.Parent - b.Parent);


import {
  
  type Node,
  type Edge,
  MarkerType,
  
} from '@xyflow/react';


export type TVuau = 'VU' | 'AU' | 'BU' | 'GU'

export type  ICompanyListItem = {
  Id: number;
  Title: string;

  CSParent?: {
    Id: number;
    Title: string;
  };

  CSColorScheme?: number;
  CSGrundKapital?: number;
  CSStammKapital?: number;
  CSAUVU?: string;
  CSLocation?: string;

  CSCoordX?: number;
  CSCoordY?: number;

  CSTeil?: number;
}

export type ICompanyRelation = {
  parentId: number;
  childId: number;
  share?: number;
}

export const companyDemoData: ICompanyListItem[] = [
  { Id: 1, Title: "Alpha Holding", CSColorScheme: 1, CSGrundKapital: 5000000, CSStammKapital: 2000000, CSAUVU: "VU", CSLocation: "Berlin", CSCoordX: 0, CSCoordY: 0, CSTeil: 100 },
  { Id: 2, Title: "Beta Group", CSColorScheme: 2, CSGrundKapital: 4200000, CSStammKapital: 1500000, CSAUVU: "AU", CSLocation: "Hamburg", CSCoordX: 200, CSCoordY: 0, CSTeil: 100 },

  { Id: 3, Title: "Alpha Logistics", CSParent: { Id: 1, Title: "Alpha Holding" }, CSColorScheme: 3, CSGrundKapital: 900000, CSStammKapital: 400000, CSAUVU: "BU", CSLocation: "Dortmund", CSTeil: 12 },
  { Id: 4, Title: "Alpha Energy", CSParent: { Id: 1, Title: "Alpha Holding" }, CSColorScheme: 2, CSGrundKapital: 1100000, CSStammKapital: 500000, CSAUVU: "BU", CSLocation: "Essen", CSTeil: 23 },
  { Id: 5, Title: "Beta Digital", CSParent: { Id: 2, Title: "Beta Group" }, CSColorScheme: 1, CSGrundKapital: 800000, CSStammKapital: 300000, CSAUVU: "BU", CSLocation: "Munich", CSTeil: 25 },
  { Id: 6, Title: "Beta Consulting", CSParent: { Id: 2, Title: "Beta Group" }, CSColorScheme: 3, CSGrundKapital: 700000, CSStammKapital: 250000, CSAUVU: "BU", CSLocation: "Cologne", CSTeil: 87 },

  { Id: 7, Title: "Alpha Logistics West", CSParent: { Id: 3, Title: "Alpha Logistics" }, CSColorScheme: 1, CSGrundKapital: 300000, CSStammKapital: 120000, CSAUVU: "GU", CSLocation: "Düsseldorf", CSTeil: 34},
  { Id: 8, Title: "Alpha Logistics East", CSParent: { Id: 3, Title: "Alpha Logistics" }, CSColorScheme: 2, CSGrundKapital: 320000, CSStammKapital: 140000, CSAUVU: "GU", CSLocation: "Leipzig", CSTeil: 55 },
  { Id: 9, Title: "Alpha Solar", CSParent: { Id: 4, Title: "Alpha Energy" }, CSColorScheme: 3, CSGrundKapital: 500000, CSStammKapital: 220000, CSAUVU: "GU", CSLocation: "Stuttgart", CSTeil: 80 },
  { Id: 10, Title: "Alpha Wind", CSParent: { Id: 4, Title: "Alpha Energy" }, CSColorScheme: 2, CSGrundKapital: 480000, CSStammKapital: 210000, CSAUVU: "GU", CSLocation: "Kiel", CSTeil: 90 },

  { Id: 11, Title: "Beta Digital Labs", CSParent: { Id: 5, Title: "Beta Digital" }, CSColorScheme: 1, CSGrundKapital: 260000, CSStammKapital: 100000, CSAUVU: "GU", CSLocation: "Frankfurt", CSTeil: 18 },
  { Id: 12, Title: "Beta Digital AI", CSParent: { Id: 5, Title: "Beta Digital" }, CSColorScheme: 2, CSGrundKapital: 270000, CSStammKapital: 110000, CSAUVU: "GU", CSLocation: "Berlin", CSTeil: 84 },
  { Id: 13, Title: "Beta Advisory", CSParent: { Id: 6, Title: "Beta Consulting" }, CSColorScheme: 3, CSGrundKapital: 200000, CSStammKapital: 90000, CSAUVU: "GU", CSLocation: "Bonn", CSTeil: 74 },
  { Id: 14, Title: "Beta Strategy", CSParent: { Id: 6, Title: "Beta Consulting" }, CSColorScheme: 1, CSGrundKapital: 210000, CSStammKapital: 95000, CSAUVU: "GU", CSLocation: "Munster", CSTeil: 31 },

  { Id: 15, Title: "Alpha Logistics Fleet", CSParent: { Id: 7, Title: "Alpha Logistics West" }, CSColorScheme: 2, CSGrundKapital: 120000, CSStammKapital: 60000, CSAUVU: "GU", CSLocation: "Duisburg", CSTeil: 51 },
  { Id: 16, Title: "Alpha Storage", CSParent: { Id: 7, Title: "Alpha Logistics West" }, CSColorScheme: 1, CSGrundKapital: 140000, CSStammKapital: 65000, CSAUVU: "GU", CSLocation: "Bochum", CSTeil: 43 },

  { Id: 17, Title: "Alpha Energy Grid", CSParent: { Id: 4, Title: "Alpha Energy" }, CSColorScheme: 3, CSGrundKapital: 350000, CSStammKapital: 180000, CSAUVU: "GU", CSLocation: "Essen", CSTeil: 43 },
  { Id: 18, Title: "Alpha Hydrogen", CSParent: { Id: 4, Title: "Alpha Energy" }, CSColorScheme: 2, CSGrundKapital: 360000, CSStammKapital: 190000, CSAUVU: "GU", CSLocation: "Hamburg", CSTeil: 56 },

  { Id: 19, Title: "Beta Digital Cloud", CSParent: { Id: 11, Title: "Beta Digital Labs" }, CSColorScheme: 1, CSGrundKapital: 160000, CSStammKapital: 80000, CSAUVU: "GU", CSLocation: "Frankfurt", CSTeil: 66 },
  { Id: 20, Title: "Beta Cybersecurity", CSParent: { Id: 11, Title: "Beta Digital Labs" }, CSColorScheme: 2, CSGrundKapital: 170000, CSStammKapital: 85000, CSAUVU: "GU", CSLocation: "Berlin", CSTeil: 77 },

  { Id: 21, Title: "Beta AI Robotics", CSParent: { Id: 12, Title: "Beta Digital AI" }, CSColorScheme: 3, CSGrundKapital: 190000, CSStammKapital: 90000, CSAUVU: "GU", CSLocation: "Munich", CSTeil: 88 },
  { Id: 22, Title: "Beta Data Systems", CSParent: { Id: 12, Title: "Beta Digital AI" }, CSColorScheme: 1, CSGrundKapital: 200000, CSStammKapital: 95000, CSAUVU: "GU", CSLocation: "Stuttgart", CSTeil: 90 },

  { Id: 23, Title: "Beta Advisory Finance", CSParent: { Id: 13, Title: "Beta Advisory" }, CSColorScheme: 2, CSGrundKapital: 130000, CSStammKapital: 70000, CSAUVU: "GU", CSLocation: "Cologne", CSTeil: 95 },
  { Id: 24, Title: "Beta Advisory Legal", CSParent: { Id: 13, Title: "Beta Advisory" }, CSColorScheme: 3, CSGrundKapital: 125000, CSStammKapital: 65000, CSAUVU: "GU", CSLocation: "Bonn", CSTeil:  50 },

  { Id: 25, Title: "Alpha Solar Tech", CSParent: { Id: 9, Title: "Alpha Solar" }, CSColorScheme: 1, CSGrundKapital: 150000, CSStammKapital: 70000, CSAUVU: "GU", CSLocation: "Stuttgart", CSTeil: 20 },
  { Id: 26, Title: "Alpha Solar Panels", CSParent: { Id: 9, Title: "Alpha Solar" }, CSColorScheme: 2, CSGrundKapital: 155000, CSStammKapital: 72000, CSAUVU: "GU", CSLocation: "Ulm", CSTeil: 11 },

  { Id: 27, Title: "Alpha Wind Turbines", CSParent: { Id: 10, Title: "Alpha Wind" }, CSColorScheme: 3, CSGrundKapital: 165000, CSStammKapital: 75000, CSAUVU: "GU", CSLocation: "Kiel", CSTeil: 15 },
  { Id: 28, Title: "Alpha Offshore", CSParent: { Id: 10, Title: "Alpha Wind" }, CSColorScheme: 1, CSGrundKapital: 170000, CSStammKapital: 78000, CSAUVU: "GU", CSLocation: "Rostock", CSTeil: 33 },

  { Id: 29, Title: "Beta Strategy Global", CSParent: { Id: 14, Title: "Beta Strategy" }, CSColorScheme: 2, CSGrundKapital: 140000, CSStammKapital: 68000, CSAUVU: "GU", CSLocation: "Berlin", CSTeil: 23 },
  { Id: 30, Title: "Beta Strategy Research", CSParent: { Id: 14, Title: "Beta Strategy" }, CSColorScheme: 3, CSGrundKapital: 145000, CSStammKapital: 70000, CSAUVU: "GU", CSLocation: "Munich", CSTeil: 10 },
  { Id: 31, Title: "Beta Strategy Research", CSColorScheme: 3, CSGrundKapital: 145000, CSStammKapital: 70000, CSAUVU: "GU", CSLocation: "Munich", CSTeil: 10 }
];


export const initialEdges: Edge[] = [
  { id: 's1-n1', source: 's1', target: 'n1', label: '100%', 
    markerEnd: {
      type: MarkerType.Arrow
    } },
  { id: 'n1-n2', source: 'n1', target: 'n2', label: '100%', 
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.Arrow
    } },
  { id: 'n1-n3', source: 'n1', target: 'n4', label: '10%', 
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.Arrow
    } },
  { id: 'n1-n4', source: 'n1', target: 'n4', type: 'smoothstep' },
  { id: 'n4-n5', source: 'n4', target: 'n5' },
];



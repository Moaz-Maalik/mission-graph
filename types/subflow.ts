export type SubflowGraphNode = {
  id: string;
  label: string;
  typeId: string;
};

export type SubflowGraphEdge = {
  from: string;
  to: string;
  type: string;
};

export type SubflowGraphResult = {
  nodes: SubflowGraphNode[];
  edges: SubflowGraphEdge[];
};

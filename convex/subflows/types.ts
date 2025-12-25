export type GraphSubflowResult = {
  nodes: {
    id: string;
    label: string;
    typeId: string;
  }[];
  edges: {
    from: string;
    to: string;
    type: string;
  }[];
};

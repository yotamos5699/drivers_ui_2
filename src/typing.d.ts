export type driver = {
  pivotKey: string;
  pivotType: "driver" | "zone";
  name: string;
  password: string;
};

export type Tasks = {
  missions: object[];
  filterdKeys: string[];
};

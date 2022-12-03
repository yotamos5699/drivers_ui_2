export const d = "s";

export const renderScreen = (cellId: string, render: any) => {
  console.log("in render screen ", render);
  let r: any = {};
  Object.keys(render).forEach((key) => (key == cellId ? (r[key] = true) : (r[key] = false)));
  console.log({ r });
  return r;
};

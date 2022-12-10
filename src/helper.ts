export const d = "s";

export const renderScreen = (cellId: string, render: any) => {
  console.log("in render screen ", render);
  let r: any = {};
  Object.keys(render).forEach((key) => (key == cellId ? (r[key] = true) : (r[key] = false)));
  console.log({ r });
  return r;
};

export const sortTableData = async (missions: any[], Midx: number) => {
  let a = [];
  missions.forEach((m: any, i: number) => {
    if (i != Midx) a.push(m);
  });
  if (missions[Midx]["isDone"] == true) {
    a.push(missions[Midx]);
    console.log("in sort table push ", { a, missions });
    return a;
  } else {
    a.unshift(missions[Midx]);
    console.log("in sort table unshift ", { a, missions });
    return a;
  }
};

export const constractMissions = (matrixData: any, castumers: any) => {
  console.log({ matrixData });
  let currentCasumersKeys = matrixData.mainMatrix.AccountKey;

  let thisCastumer: any[] = [];
  let missionsArray: object[] = [];

  for (let i = 0; i <= currentCasumersKeys.length - 1; i++) {
    thisCastumer = castumers.filter((castumer: any) => {
      return castumer["מפתח"] == currentCasumersKeys[i].toString();
    });
    if (thisCastumer?.length) {
      console.log("resets missions !!!");
      let record = {
        שם: thisCastumer[0]["שם חשבון"],
        כתובת: thisCastumer[0]["כתובת"],
        נייד: thisCastumer[0]["טלפון נייד"],
        חוב: thisCastumer[0]["יתרת חשבון"],

        isDone: false,
      };
      missionsArray.push(record);
    }
  }
  return missionsArray;
};

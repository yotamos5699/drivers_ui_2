import { arrayMove } from "@dnd-kit/sortable";
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
        id: thisCastumer[0]["מפתח"],
        isDone: false,
      };
      missionsArray.push(record);
    }
  }
  return missionsArray;
};

export const missionsReducer = (state: any, action: any) => {
  switch (action.type) {
    case "dnd":
      console.log("dispatch is dnd");
      const oldIndex: number = state.data.findIndex((row: any) => row.id === action.payload.startIndex);
      const newIndex: number = state.data.findIndex((row: any) => row.id === action.payload.endIndex);
      return { ...state, data: arrayMove(state.data, oldIndex, newIndex) };

    case "isDone":
      console.log("dispatch is IsDone");
      return {
        ...state,
        data: [
          ...state.data.map((row: any) => {
            if (row.id == action.payload.startIndex) return { ...row, isDone: !row.isDone };
            else return row;
          }),
        ],
      };

    case "details":
      console.log("dispatch is details");
      return state;
    case "navigate":
      console.log("dispatch is navigate");
      return state;
    case "dail":
      console.log("dispatch is dail");
      return state;
    // case 'reset':
    //   return init(action.payload);
    default:
      console.log("Unsupported action in missions reduser");
  }
};

import { Action } from "@dnd-kit/core/dist/store";
import { arrayMove } from "@dnd-kit/sortable";
import { GrCurrency } from "react-icons/gr";
import { QueryCache } from "@tanstack/react-query";
import Returns from "./components/Returns";
import { Tasks } from "./typing";
import { useEffect } from "react";
//const ResApiUrl = "https://script.google.com/macros/s/AKfycbyTQJsXqMszO_cxlQCgRYiamH6cTW5Eoj-4-Fers5I/dev";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
export const d = "s";
const queryCash = new QueryCache();
export const renderScreen = (cellId: string, render: any) => {
  console.log("in render screen ", { render, cellId });
  let r: any = {};
  Object.keys(render).forEach((key) => (key == cellId ? (r[key] = true) : (r[key] = false)));
  console.log({ r });
  return { data: { ...r }, subKey: cellId };
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

export const constractMissions = (matrixData: any, castumers: any, driver: any, from: null | string = null) => {
  if (from) console.log({ from });
  console.log({ castumers, matrixData });
  const accountKeys = matrixData.mainMatrix.AccountKey;
  let currentCasumersKeys =
    driver === "admin"
      ? accountKeys
      : accountKeys.filter((key: string, i: number) => {
          if (matrixData.mainMatrix.DriverID[i] == driver) {
            console.log("driver thet returns !!!!!", { key });
            return key;
          }
        });
  console.log({ currentCasumersKeys });
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
        כתובת: `${thisCastumer[0]["כתובת"]} ${thisCastumer[0]["עיר"]}`,
        נייד: thisCastumer[0]["טלפון נייד"],
        חוב: thisCastumer[0]["יתרת חשבון"],
        id: thisCastumer[0]["מפתח"],
        isDone: false,
      };
      missionsArray.push(record);
    }
  }
  const filterdKeys = currentCasumersKeys;
  console.log({ missionsArray });
  return { missions: [...missionsArray], filterdKeys: [...filterdKeys] };
};

export const updateResponseDB = async (data: any, type: string, payType?: string, mission?: any) => {
  console.log({ mission });
  console.log("in updateResponseDB", { type, data, payType });
  // console.log({ mission });
  const LS = localStorage.getItem("driver");
  if (LS === null || LS === "undefined") return;
  const driver = await JSON.parse(LS);

  if (type == "mission") {
    const Castumer = await mission;
    const castumerNum = Castumer["id"];
    console.log("in updateResponseDB=> missions");
    let params = "";
    params += "uuid=" + Math.floor(Math.random() * 100000) + "&";
    for (const [key, value] of Object.entries(data)) {
      params += `${key}=${value}&`;
    }
    params += "castumerNum=" + castumerNum + "&";
    params += "driverNum=" + driver.data.pivotKey + "&";
    params += "driver=" + driver.data.name + "&";
    params += "type=" + type;
    fetch(`${ResApiUrl}?${encodeURI(params)}`, { mode: "no-cors" })
      .then(() => console.log("sent ", type))
      .catch((e) => console.log("error in ", type, e));
  }
  if (type == "payments") {
    const Castumer = await mission;
    const castumerNum = Castumer["מפתח"];
    console.log({ Castumer });
    const castumerName = Castumer["שם חשבון"];
    console.log("in updateResponseDB=> payments ", payType);
    const d = await data;
    console.log({ driver });
    const UUID = Math.floor(Math.random() * 100000);

    for (let i = 0; i <= d.length - 1; i++) {
      let params = "";
      if (d[i].amount > 0) {
        params += "uuid=" + UUID + "&";
        params += "castumer=" + castumerNum + "&";
        params += "castumerName=" + castumerName + "&";
        params += "driverNum=" + driver.data.pivotKey + "&";
        params += "driver=" + driver.data.name + "&";
        params += "paymentMethod=" + payType + "&";
        params += `coinName=${payType == "שיק" ? null : d[i].name}&amount=${payType == "שיק" ? null : d[i].amount}&`;
        params += `coinValue=${payType == "שיק" ? null : d[i].billValue}&`;
        params += "type=" + type;

        fetch(`${ResApiUrl}?${encodeURI(params)}`, { mode: "no-cors" })
          .then(() => console.log("sent ", type))
          .catch((e) => console.log("error in ", type, e));
      }
    }
  }

  if (type == "returns") {
    console.log("in func", { data });
    const Castumer = await mission;

    console.log({ Castumer });
    const castumerName = Castumer["שם חשבון"];
    const castumerNum = await mission["מפתח"];
    const UUID = Math.floor(Math.random() * 100000);
    for (let i = 0; i <= data.list.length - 1; i++) {
      let params = "";
      params += "uuid=" + UUID + "&";
      params += "castumerNum=" + castumerNum + "&";
      params += "castumer=" + castumerName + "&";
      params += "driverNum" + driver.data.pivotKey + "&";
      params += "driver=" + driver.data.name + "&";
      params += "item=" + data.list[i].item + "&" + "amount=" + data.list[i].amount + "&";
      params += "type=" + type;
      console.log({ params });
      fetch(`${ResApiUrl}?${encodeURI(params)}`, { mode: "no-cors" })
        .then(() => console.log("sent ", type))
        .catch((e) => console.log("error in ", type, e));
    }
  }
};

export const missionsReducer = (state: any, action: any) => {
  switch (action.type) {
    case "init":
      return { endIndex: 0, startIndex: 0, data: action.payload.data };
    case "dnd":
      console.log("dispatch is dnd");
      const oldIndex: number = state.data.findIndex((row: any) => row.id === action.payload.startIndex);
      const newIndex: number = state.data.findIndex((row: any) => row.id === action.payload.endIndex);
      return { ...state, data: arrayMove(state.data, oldIndex, newIndex) };

    case "isDone":
      console.log("dispatch is IsDone");
      console.log({ state, action });

      const updatedData = {
        ...state,
        data: [
          ...state.data.map((row: any) => {
            if (row.id == action.payload.startIndex) return { ...row, isDone: !row.isDone };
            else return row;
          }),
        ],
      };
      console.log({ updatedData }, action.payload.startIndex);
      const task = updatedData.data.filter((row: any) => row.id == action.payload.startIndex)[0];
      console.log({ task });
      updateResponseDB(task, "mission", "", task);
      return updatedData;
    case "cash":
      return { ...state, data: action.payload.data };
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
const checkLocalStorage = async (page: string) => {
  const storage = localStorage.getItem(page);
  if (typeof storage === "string" && storage != "undefined" && storage != null) {
    return await JSON.parse(storage);
    console.log("passded test ", { storage });
  }
  return null;
};

export const useInitializedState = async (page: string, props?: any, dooerFunc?: any, dispatch?: any) => {
  let data;
  switch (page) {
    case "missions":
      data = await checkLocalStorage(page);
      console.log("missions data ", { data });
      const missions = data !== null ? data : await props.missions;
      console.log("after selecting data sourch ", missions);

      return {
        data: missions,
        startIndex: 0,
        endIndex: 0,
      };
    case "login":
      console.log("useInitializedState login");
      data = await checkLocalStorage(page);
      console.log("data in login dispath ", data);
      return data === false ? false : true;
    case "storage":
      console.log("useInitializedState storage");
      data = await checkLocalStorage(page);
      return data === false ? false : true;

    case "reset":
      return localStorage.clear();

    case "driver":
      data = await checkLocalStorage(page);
      return data ? data : null;
  }
};

export const backToLogin = (setRender: any, render: any) => {
  localStorage.clear();
  queryCash.clear();
  setRender({ ...render, data: defaultRender });
};

export const defualtCurrencys = [
  { amount: 0, name: "שקל" },
  { amount: 0, name: "שנקל" },
  { amount: 0, name: "חמש" },
  { amount: 0, name: "עשר" },
  { amount: 0, name: "עשרים" },
  { amount: 0, name: "חמישים" },
  { amount: 0, name: "מאה" },
  { amount: 0, name: "מאתיים" },
];

export const defaultRender = {
  login: true,
  details: false,
  table: false,
  nav: false,
  pay: false,
  isDone: false,
  storage: false,
  admin: false,
};

const loggerPass = {
  var: true,
  general: true,
  current: true,
};

export const Logger = (value: any, msg: string = "", pass?: string) => {
  useEffect(() => {
    console.log(msg + " --Logger :", { value });
  }, [value]);
};

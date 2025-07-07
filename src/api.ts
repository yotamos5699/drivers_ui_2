import axios from "axios";
import Missions from "./components/Missions";
const log = true;
//import { createTRPCClient } from "@trpc/client";
const ResApiUrl = "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
const mockMatrix = {
  matrixID: "66afcadc5a695e869b1b99a400787206debe958825867edb08c883bf343afa05",
  matrixName: "מטריצה עם שם חדש",
  matrixesData: {
    mainMatrix: {
      matrixID: "66afcadc5a695e869b1b99a400787206debe958825867edb08c883bf343afa05",
      ActionID: [2, 1, 1, 1],
      AccountKey: ["6027", "6028", "6036", "6043"],
      DocumentID: [1, 1, 1, 1],
      DriverID: ["qewr135256edrfh", "qewr135256edrfh", "qewr135256edrfh", "qewr135256edrfh"],
      ActionAutho: ["Default", "Default", "Default", "Default"],
      itemsHeaders: ["HI250SA", "SX250SA", "AB500SA", "XR100SA"],
      itemsNames: ["הרנה 250 גרם", "גת SPXP", "אבו מיסמר גדול", "גת XR"],
      cellsData: [
        [1, 1, 1, 1],
        [0, 2, 0, 1],
        [1, 0, 0, 1],
        [0, 3, 0, 1],
      ],
    },
    changesMatrix: {
      matrixConfig: null,
      matrixGlobalData: null,
      cellsData: [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
      docData: [null, null, null, null],
      metaData: [null, null, null, null],
    },
  },
  Date: "11/26/2022, 11:48:39 AM",
  isBI: true,
  isInitiated: true,
};

const ofekBarier =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOiJOTyBDT05GSUcgT0JKRUNUIiwidXNlcklEIjoiNjM1OGY4NzE3ZGQ5NWVjZWVlNTNlYWMzIn0sImlhdCI6MTY3MTg5NjY0Nn0.3mmq_cIKdYZSdywQeRXzpdv6CowPJuEEI9Q57yHNKFo";

const BaseHaURL = "https://bizmod-ha-api-001.onrender.com/api";
//const lastMatrixUrl = "http://localhost:3000/api/loadmatrixes";
const driversUrl = "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec";
const currentPaymentsUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec?type=getcurrentpeyments";

export const getDriverPayments = async () => {
  return await axios(currentPaymentsUrl, { withCredentials: false })
    .then((res) => {
      log && console.log("drivers data ", res.data);

      return res.data;
    })
    .catch((err) => console.log("error in google drivers !!!", err));
};

const fetchItemsWeighet = async () => {};

export const fetchLastMatrix = async () => {
  const headers = {
    "Content-Type": "application/json",
    authorization: ofekBarier,
  };

  return await axios
    .post(
      BaseHaURL + "/loadmatrixes",
      {},
      {
        withCredentials: false,
        headers: headers,
      }
    )
    .then((res) => {
      log && console.log("inner matrix ", res.data.result.data);
      //console.log("last matrix ", res.data.result.data[0].matrixesData);
      return res.data.result.data[0].matrixesData;
    });
};
//console.log({ mockMatrix });
//return mockMatrix;
// .catch((err) => console.log);
//};
export const fetchCurrentDayMarixes = async () => {
  const startDate = new Date(new Date(new Date()).setUTCHours(0, 0, 0, 0));
  const endDate = new Date(new Date(new Date()).setHours(23, 59, 59));

  const params = {
    collection: "MtxLog",
    searchParams: {
      Date: {
        $gte: startDate,
        $lte: endDate,
      },
    },
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: ofekBarier,
  };

  return await axios
    .post(BaseHaURL + "/getData", params, {
      headers: headers,
    })
    .then((res) => {
      log && console.log("current day matrixes ", res.data);
      return res.data.result.data;
    })
    .catch((err) => console.log({ err }));
};

export const fetchDriverSummary = async () => {
  return fetchItemsData().then();
};

export const fetchMessageData = async (castumer: any) => {
  const ID = await castumer["מפתח"];
  const url =
    "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec?type=getmessage&id=" +
    ID;

  return await axios(url, { withCredentials: false })
    .then((res) => {
      log && console.log("fetch message data !!!!!! ", res.data);

      return res.data;
    })
    .catch((err) => console.log("error in google drivers !!!", err));
};

const defaultMessagesUrl =
  "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec?type=singleDefaultMessage";

export const fetchDefaultMessageData = async (castumer: any) => {
  const ID = await castumer["מפתח"];
  const url = defaultMessagesUrl + "&id=" + ID;
  console.log({ ID });
  return await axios(url, { withCredentials: false })
    .then((res) => {
      log && console.log("fetch default message data !!!!!! ", res.data, { ID });

      return res.data;
    })
    .catch((err) => console.log("error in google drivers !!!", err));
};

export const fetchMessagesData = async () => {
  const myHeaders = new Headers();
  myHeaders.append("mode", "no-cors");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  return await fetch(`ResApiUrl?${encodeURI("type=getmessages")}`, requestOptions)
    .then((response) => response.text())
    .then((result) => log && console.log(result))
    .catch((error) => console.log("error", error));
};

const carsUrl =
  "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec?type=cars";
export const fetchCarsData = async () => {
  return await axios(carsUrl, { withCredentials: false })
    .then((res) => {
      log && console.log("drivers data ", res.data);

      return res.data;
    })
    .catch((err) => console.log("error in google drivers !!!", err));
};

export const fetchDriversData = async (params = "") => {
  return await axios(driversUrl + params, { withCredentials: false })
    .then((res) => {
      log && console.log("drivers data ", res.data);

      return res.data;
    })
    .catch((err) => console.log("error in google drivers !!!", err));
};

export const fetchCastumersData = async () => {
  let data = {
    TID: "2",
    // ,
    // sortKey: { "קוד מיון": 300 },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: ofekBarier,
  };

  return await axios
    .post(BaseHaURL + "/getrecords", data, {
      headers: headers,
    })
    .then((res) => {
      log && console.log("castumers data ", res.data.data);
      return res.data.data.filter((c: any) => c["קוד מיון"] === 300 || c["קוד מיון"] === 305);
      // .map((customer) => {;
    })
    .catch((err) => console.log({ err }));
};

export const fetchItemsData = async () => {
  let data = {
    TID: "1",
    sortKey: { מחסן: 1 },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: ofekBarier,
  };

  return await axios
    .post("https://bizmod-ha-api-001.onrender.com/api/getrecords", data, {
      headers: headers,
    })
    .then((res) => {
      log && console.log("items data  ", res.data);
      log && console.log("items data.data returned ", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
};

export const fetchItemsDataWeight = async () => {
  let data = {
    TID: "1",
    sortKey: { מחסן: 1 },
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: ofekBarier,
  };

  return await axios
    .post("https://bizmod-ha-api-001.onrender.com/api/getrecords", data, {
      headers: headers,
    })
    .then((res) => {
      log && console.log("items data  ", res.data);
      log && console.log("items data.data returned ", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
};
export const fetchMessagesContent = async (data: any) => {
  return await axios
    .post(ResApiUrl + data)
    .then((res) => {
      log && console.log("items data  ", res.data);
      log && console.log("items data.data returned ", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
};

export const setMatrixUrl =
  "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec";

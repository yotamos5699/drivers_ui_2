import axios from "axios";
//import { createTRPCClient } from "@trpc/client";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
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
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOiJOTyBDT05GSUcgT0JKRUNUIiwidXNlcklEIjoiNjM1OGY4NzE3ZGQ5NWVjZWVlNTNlYWMzIn0sImlhdCI6MTY2OTEwMzEzOH0.caIeyjcTcK0BIe_opei_VbifBWEwQAZkjeR6VIYv0kE";

const BaseHaURL = "https://bizmod-ha-api-001.onrender.com/api";
//const lastMatrixUrl = "http://localhost:3000/api/loadmatrixes";
const driversUrl =
  "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec";

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
      console.log("inner matrix ", res.data.result.data);
      //console.log("last matrix ", res.data.result.data[0].matrixesData);
      return res.data.result.data[0].matrixesData;
    });
};
//console.log({ mockMatrix });
//return mockMatrix;
// .catch((err) => console.log);
//};
export const fetchCurrentDayMarixes = async () => {
  const startDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const endDate = new Date(new Date().setHours(23, 59, 59));

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
      console.log("current day matrixes ", res.data);
      return res.data.result.data;
    })
    .catch((err) => console.log({ err }));
};

export const fetchDriverSummary = async () => {
  return fetch(ResApiUrl + "?type=routData").then((res) => res.json());
};
export const fetchDriversData = async () => {
  return await axios(driversUrl, { withCredentials: false })
    .then((res) => {
      console.log("drivers data ", res.data);

      return res.data;
    })
    .catch((err) => console.log("error in google drivers !!!", err));
};

export const fetchCastumersData = async () => {
  let data = {
    TID: "2",
    sortKey: { "קוד מיון": 300 },
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
      console.log("castumers data ", res.data.data);
      return res.data.data;
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
    .post(BaseHaURL + "/getrecords", {
      headers: headers,
    })
    .then((res) => {
      console.log("castumers data ", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
};

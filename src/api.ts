import axios from "axios";
//import { createTRPCClient } from "@trpc/client";

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

const lastMatrixUrl = "https://bizmod-ha-api-001.onrender.com/api/loadmatrixes";
//const lastMatrixUrl = "http://localhost:3000/api/loadmatrixes";
const driversUrl =
  "https://script.googleusercontent.com/macros/echo?user_content_key=Fqcd45gI2kQcwlVQqfhtiVSgcw0uXd7qPl3s43Hrk16gAGnfvI0dhzpaDvvw9K29zW1TcCAQ8nlKOzx9qPWcbvQpL4IppkDxm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMn-AVuQdkoz4dmqGuvSPPzhahxZbFP7z80rUHEk_r8AqiYkD31LwkqTYQ85ycG6XdxQTipwiRHVDjfL4SbuQeXBIndAU2515A&lib=MLsM0LIWSq2RcZhKp-OZc4gfx44b5R80M";

const castumersUrl = "https://bizmod-ha-api-001.onrender.com/api/getrecords";

export const fetchLastMatrix = async () => {
  const headers = {
    "Content-Type": "application/json",
    authorization: ofekBarier,
  };

  return await axios
    .post(
      lastMatrixUrl,
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
    .post(castumersUrl, data, {
      headers: headers,
    })
    .then((res) => {
      console.log("castumers data ", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
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
    .post(castumersUrl, data, {
      headers: headers,
    })
    .then((res) => {
      console.log("castumers data ", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
};

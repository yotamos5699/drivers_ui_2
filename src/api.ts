import axios from "axios";

const ofekBarier =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmZXRjaGVkRGF0YSI6eyJzdGF0dXMiOiJ5ZXMiLCJjb25maWdPYmoiOiJOTyBDT05GSUcgT0JKRUNUIiwidXNlcklEIjoiNjM1OGY4NzE3ZGQ5NWVjZWVlNTNlYWMzIn0sImlhdCI6MTY2OTEwMzEzOH0.caIeyjcTcK0BIe_opei_VbifBWEwQAZkjeR6VIYv0kE";

const lastMatrixUrl = "https://blooming-fjord-11867.herokuapp.com/api/loadmatrixes";
//const lastMatrixUrl = "http://localhost:3000/api/loadmatrixes";
const driversUrl =
  "https://script.googleusercontent.com/macros/echo?user_content_key=Fqcd45gI2kQcwlVQqfhtiVSgcw0uXd7qPl3s43Hrk16gAGnfvI0dhzpaDvvw9K29zW1TcCAQ8nlKOzx9qPWcbvQpL4IppkDxm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnMn-AVuQdkoz4dmqGuvSPPzhahxZbFP7z80rUHEk_r8AqiYkD31LwkqTYQ85ycG6XdxQTipwiRHVDjfL4SbuQeXBIndAU2515A&lib=MLsM0LIWSq2RcZhKp-OZc4gfx44b5R80M";

const castumersUrl = "https://blooming-fjord-11867.herokuapp.com/api/getrecords";

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
      //   console.log("sssssssssssss", res.data);
      return res.data.result.data[0].matrixesData;
    })

    .catch((err) => console.log);
};

export const fetchDriversData = async () => {
  return await axios(driversUrl, { withCredentials: false })
    .then((res) => {
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
      console.log("res .data ////", res.data.data);
      return res.data.data;
    })
    .catch((err) => console.log);
};

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useContext } from "react";
import { fetchItemsData, fetchItemsDataWeight } from "../api";
import { Logger } from "../helper";
import useLocalStorage from "../Hooks/useLocalStorage";

//import DataRow fro
type StorageProps = {
  matrix: any;
  filterdKeys: string[];
  mission: any;
  castumers: any;
  handleGlobalRender: any;
  setStorageHeaders: any;
};

function Storage(props: StorageProps) {
  console.log("storage", { props });
  //const [storageData,setStorageData] = useLocalStorage('storageData',null)
  const [storageData, setStorageData] = useLocalStorage("storageData", { data: null, subKey: "storageData" });
  const [storageStyles, setStorageStyles] = useLocalStorage("storageStyles", { data: null, subKey: "storageStyles" });
  const [storageAddedSpecs, setStorageAddedSpecs] = useLocalStorage("sorageAddedSpecs", {
    data: { itemsWeight: null },
  });
  const itemsData = useQuery({ queryKey: ["itemsData"], queryFn: fetchItemsData });
  itemsData.data &&
    storageAddedSpecs.data.itemsWeight == null &&
    calcItemsWeight(itemsData.data, storageData.data, setStorageAddedSpecs);

  // const [render, setReder] = useState({
  //   main: true,
  //   cont: false,
  // });

  useEffect(() => {
    if (storageData.data !== null)
      props.setStorageHeaders({
        data: { headers: Object.keys(storageData.data[0]), amount: storageData?.data?.length },
      });
    // if (itemsData.data && storageData.data != null && storageAddedSpecs.data.itemsWeight == null)
    //   calcItemsWeight(itemsData.data, storageData.data, setStorageAddedSpecs);
  }, [storageData.data]);
  console.log("in storage ", { props });
  useEffect(() => {
    if (storageData.data && storageStyles.data) {
      console.log("using local data ", { storageData, storageStyles });
      props.setStorageHeaders({
        data: { headers: Object.keys(storageData.data[0]), amount: storageData?.data?.length },
      });
      return;
    }

    let AccountKeys = props.filterdKeys;
    let AccountNames = AccountKeys.map((Account: any) => {
      let card: any[] = props.castumers.filter((cas: any) => cas["מפתח"] == Account);

      return card[0]["שם חשבון"];
    });

    let cellsData = props.matrix.mainMatrix.cellsData;
    let itemsNames: any[] = props.matrix.mainMatrix.itemsNames;
    if (itemsNames[0] != "לקוח") {
      itemsNames.unshift("לקוח");
    }
    let record: any = {};
    let innerArray;
    let details = [];
    let stMtx: boolean[][] = [];
    let AllMatrixKeys = props.matrix.mainMatrix.AccountKey;
    try {
      for (let i = 0; i <= AccountKeys.length - 1; i++) {
        record = {};
        innerArray = [];
        innerArray.push(false);
        for (let x = 0; x <= AllMatrixKeys.length - 1; x++) {
          if (AccountKeys[i] == AllMatrixKeys[x]) {
            record[itemsNames[0]] = AccountNames[i];
            for (let j = 1; j <= itemsNames.length - 1; j++) {
              record[itemsNames[j]] = cellsData[x][j - 1];
              innerArray.push(false);
            }

            record["isDone"] = false;
            details.push(record);

            innerArray.length > 0 && stMtx.push(innerArray);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (stMtx) {
      setStorageStyles({ ...storageStyles, data: stMtx });
    }
    record && setStorageData({ ...storageData, data: details });
    console.log("after set up in storage ", { storageData, storageStyles });
  }, []);

  const handleChange = (e: any, p: any) => {
    //  console.log({ e, p });
    if (e.target.id == "isDone") {
      let rowIndex = 0;
      let newData = storageData.data.map((row: any, idx: number) => {
        if (idx == p) {
          rowIndex = idx;
          return { ...row, isDone: !row["isDone"] };
        } else return row;
      });

      let sortedData: any = [];
      let mtx: any = [];

      newData.forEach((row: object, i: number) => {
        if (i != rowIndex) {
          mtx.push(storageStyles.data[i]);
          sortedData.push(row);
          //    console.log({ sortedData });
        }
      });

      if (newData[rowIndex]["isDone"] == true) {
        sortedData.push(newData[rowIndex]);
        mtx.push(storageStyles.data[rowIndex]);
      } else {
        sortedData.unshift(newData[rowIndex]);
        mtx.unshift(storageStyles.data[rowIndex]);
      }
      setStorageData({ data: [...sortedData] });
      setStorageStyles({ data: [...mtx] });
    }
  };

  // useEffect(() => {

  //   console.log("in use effect for loging weighet !!!!!!");
  // }, [itemsData.data, storageData.data]);
  return (
    <div className="mt-56">
      {storageData?.data && (
        <table>
          {/* <thead className="bg-white border-b">
           
          </thead> */}
          <tbody>
            {storageData.data.map((row: any, idx: number) => (
              <tr
                key={idx + 3434}
                className={row["isDone"] == false ? "tr" : "tr bg-gray-200"}
                onClick={(e) => handleChange(e, row)}
              >
                {Object.values(row).map(
                  (cell: any, ci) =>
                    Object.keys(row)[ci] != "isDone" && (
                      <td
                        key={ci + idx}
                        onClick={() => {
                          if (storageStyles.data != undefined) {
                            let nm = storageStyles.data;
                            // console.log(nm[idx][ci]);
                            //  console.log({ idx, ci });
                            nm[idx][ci] = !nm[idx][ci];
                            setStorageStyles({ data: [...nm] });
                          }
                        }}
                        /*@ts-ignore */
                        className={
                          storageStyles.data[idx][ci] == false ? "td " : ci != 0 && "td bg-green-600 text-white"
                        }
                      >
                        {cell}
                      </td>
                    )
                )}
                <td className={"td3"}>
                  {storageAddedSpecs?.data?.itemsWeight
                    ? storageAddedSpecs.data.itemsWeight
                        .filter((num: any) => num.castumer == row["לקוח"])[0]
                        .weighet.toFixed(2)
                    : "מחשב"}
                </td>
                <td className={"td"}>
                  <input
                    className="w-6 h-6 justify-center text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    id="isDone"
                    type={"checkbox"}
                    onChange={(e: any) => handleChange(e, idx)}
                    checked={row["isDone"]}
                  />
                </td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      )}
      {!storageData?.data?.filter((row: any) => row.isDone === false)[0] && (
        <button className={"btn1"} id="stockReady" onClick={props.handleGlobalRender}>
          המשך
        </button>
      )}
    </div>
  );
}

export default Storage;
function calcRowItemsWeight(itemsData: any[], storageData: any) {
  console.log("calcItemsWeight", { itemsData, storageData });

  let amount: number = 0;
  Object.keys(storageData).forEach((key: string) => {
    key != "לקוח" &&
      itemsData.forEach((item) => {
        item["שם פריט"] == key;
        amount += item["משקל"] * storageData[key];
      });
  });
  return amount;
}

function calcItemsWeight(itemsData: any[], storageData: any[], setStorageAddedSpecs: any) {
  console.log("in funccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
  console.log("calcItemsWeight", { itemsData, storageData });

  let itemsToWeight = [];

  for (let i = 0; i <= storageData.length - 1; i++) {
    let record: any = {};
    record["weighet"] = 0;
    Object.keys(storageData[i]).forEach((key: string) => {
      if (key == "לקוח") {
        record["castumer"] = storageData[i][key];
      } else {
        itemsData.forEach((item) => {
          if (item["שם פריט"] == key) record["weighet"] += item["משקל"] * storageData[i][key];
        });
      }
    });

    itemsToWeight.push(record);
  }

  setStorageAddedSpecs({ data: { itemsWeight: [...itemsToWeight] } });
  //itemsToWeight;
}

// // "{"data":[
// //   {"לקוח":"דני אדרי","גת XP":3,"קימבו גדול":0,"הרנה 250 גרם":0,"אבו מיסמר גדול":0,"isDone":true},

// // יתרה כמותית במלאי
// // :
// // 9
// // מחסן
// // :
// // 1
// מפתח פריט
// :
// "XP100SA"
// מפתח פריט אב
// :
// "XP100BG"
// משקל
// :
// 0.1
// קוד מיון
// :
// 53000
// שם פריט
// :
// "גת XP"
// שם פריט אב
// :
// "שקית לגת XP100"
// תרה כמותית אב
// :
// -21855.5

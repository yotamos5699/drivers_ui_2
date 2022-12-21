import React, { useEffect, useState, useContext } from "react";
import useLocalStorage from "../Hooks/useLocalStorage";

//import DataRow fro
type StorageProps = {
  matrix: any;
  filterdKeys: string[];
  mission: any;
  castumers: any;
  handleGlobalRender: any;
};

function Storage(props: StorageProps) {
  //console.log({ props });
  //const [storageData,setStorageData] = useLocalStorage('storageData',null)
  const [storageData, setStorageData] = useLocalStorage("storageData", { data: null, subKey: "storageData" });
  const [storageStyles, setStorageStyles] = useLocalStorage("storageStyles", { data: null, subKey: "storageStyles" });
  // const [render, setReder] = useState({
  //   main: true,
  //   cont: false,
  // });
  console.log("in storage ", { props });
  useEffect(() => {
    if (storageData.data && storageStyles.data) {
      console.log("using local data ", { storageData, storageStyles });
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
      setStorageStyles({ data: stMtx });
    }
    record && setStorageData({ data: details });
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

  return (
    <div>
      {storageData?.data && (
        <table>
          <thead className="bg-white border-b">
            <tr key={"asd"} className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
              {Object.keys(storageData.data[0]).map(
                (header, idx) =>
                  header != "isDone" && (
                    <td className="td" key={idx + 1111}>
                      {header}
                    </td>
                  )
              )}
              <td className="td">מוכן</td>
            </tr>
          </thead>
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
                          storageStyles.data[idx][ci] == false ? "td" : ci != 0 && "td bg-green-600 text-white"
                        }
                      >
                        {cell}
                      </td>
                    )
                )}
                <td className={""}>
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

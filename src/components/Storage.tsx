import React, { useEffect, useState } from "react";

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
  const [data, setData] = useState<any>();
  const [styleMatrix, setStyleMatrix] = useState<any>();
  const [render, setReder] = useState({
    main: true,
    cont: false,
  });

  useEffect(() => {
    checkIfReady();
  }, [data, styleMatrix]);
  useEffect(() => {
    // const STORED2 = window.localStorage.getItem("stylesData");
    // if (STORED2 != "undefined" && STORED2 != null)
    //   setStyleMatrix([...JSON.parse(STORED2)]);
    // const STORED = window.localStorage.getItem("storageData");
    // if (STORED != "undefined" && STORED != null)
    //   return setData([...JSON.parse(STORED)]);
    console.log("after return in storage");
    let AccountKeys = props.filterdKeys;
    // props.matrix.mainMatrix.AccountKey;
    let AccountNames = AccountKeys.map((Account: any) => {
      let card: any[] = props.castumers.filter(
        (cas: any) => cas["מפתח"] == Account
      );

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
      setStyleMatrix(stMtx);
    }
    record && setData(details);
  }, []);

  const handleChange = (e: any, p: any) => {
    //  console.log({ e, p });
    if (e.target.id == "isDone") {
      let rowIndex = 0;
      let newData = data.map((row: any, idx: number) => {
        if (idx == p) {
          rowIndex = idx;
          return { ...row, isDone: !row["isDone"] };
        } else return row;
      });

      let sortedData: any = [];
      let mtx: any = [];

      newData.forEach((row: object, i: number) => {
        if (i != rowIndex) {
          mtx.push(styleMatrix[i]);
          sortedData.push(row);
          //    console.log({ sortedData });
        }
      });

      if (newData[rowIndex]["isDone"] == true) {
        sortedData.push(newData[rowIndex]);
        mtx.push(styleMatrix[rowIndex]);
      } else {
        sortedData.unshift(newData[rowIndex]);
        mtx.unshift(styleMatrix[rowIndex]);
      }
      setData([...sortedData]);
      setStyleMatrix([...mtx]);
    }
  };
  const checkIfReady = () => {
    let ready: boolean;
    let filter = data?.filter((row: any) => row.isDone === false);

    if (data && filter.length === 0) ready = true;
    else ready = false;

    setReder((prev) => {
      return { ...prev, cont: ready };
    });
  };
  return (
    <div>
      {data && (
        <table>
          <thead className="bg-white border-b">
            <tr
              key={"asd"}
              className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
            >
              {Object.keys(data[0]).map(
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
            {data.map((row: any, idx: number) => (
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
                          if (styleMatrix != undefined) {
                            let nm = styleMatrix;
                            // console.log(nm[idx][ci]);
                            //  console.log({ idx, ci });
                            nm[idx][ci] = !nm[idx][ci];
                            setStyleMatrix([...nm]);
                          }
                        }}
                        /*@ts-ignore */
                        className={
                          styleMatrix[idx][ci] == false
                            ? "td"
                            : ci != 0 && "td bg-green-600 text-white"
                        }
                      >
                        {cell}
                      </td>
                    )
                )}
                <td>
                  <input
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
      {render.cont && (
        <button
          className={"btn1"}
          id="stockReady"
          onClick={props.handleGlobalRender}
        >
          המשך
        </button>
      )}
    </div>
  );
}

export default Storage;

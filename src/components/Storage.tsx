import React, { useEffect, useState } from "react";

//import DataRow fro
type StorageProps = {
  matrix: any;
  mission: any;
  castumers: any;
};

function Storage(props: StorageProps) {
  console.log({ props });
  const [data, setData] = useState<any>();
  const [styleMatrix, setStyleMatrix] = useState<any>();
  useEffect(() => {
    let AccountKeys = props.matrix.mainMatrix.AccountKey;
    let AccountNames = AccountKeys.map((Account: any) => {
      let card: any[] = props.castumers.filter((cas: any) => cas["מפתח"] == Account);
      console.log({ card });
      return card[0]["שם חשבון"];
    });
    console.log({ AccountNames });
    let cellsData = props.matrix.mainMatrix.cellsData;
    console.log({ cellsData });
    let itemsNames: any[] = props.matrix.mainMatrix.itemsNames;
    if (itemsNames[0] != "לקוח") {
      itemsNames.unshift("לקוח");
    }
    let record: any = {};
    let innerArray;
    console.log({ itemsNames });
    let details = [];
    let stMtx: boolean[][] = [];

    try {
      for (let i = 0; i <= AccountKeys.length - 1; i++) {
        record = {};
        innerArray = [];
        innerArray.push(false);
        record[itemsNames[0]] = AccountNames[i];
        for (let j = 1; j <= itemsNames.length - 1; j++) {
          console.log("cells data error ", cellsData[i][j - 1]);
          record[itemsNames[j]] = cellsData[i][j - 1];
          innerArray.push(false);
        }
        record["isDone"] = false;
        details.push(record);
        console.log({ innerArray, stMtx, i });
        innerArray.length > 0 && stMtx.push(innerArray);
        console.log({ details, record });
      }
    } catch (err) {
      console.log(err);
    }
    if (stMtx) {
      setStyleMatrix(stMtx);
      console.log("in set styles matreix ");
      console.log({ styleMatrix, stMtx });
    }
    record && setData(details);
    console.log({ styleMatrix });
  }, []);

  const handleChange = (e: any, p) => {
    console.log({ e, p });
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
          console.log({ sortedData });
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

  return (
    <div>
      {data && (
        <table>
          <thead className="bg-white border-b">
            <tr key={"asd"} className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
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
                            console.log(nm[idx][ci]);
                            console.log({ idx, ci });
                            nm[idx][ci] = !nm[idx][ci];
                            setStyleMatrix([...nm]);
                          }
                        }}
                        /*@ts-ignore */
                        className={styleMatrix[idx][ci] == false ? "td" : ci != 0 && "td bg-green-600 text-white"}
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
    </div>
  );
}

export default Storage;

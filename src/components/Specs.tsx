import React, { useEffect, useState } from "react";
import { DataRow } from "./Table";
//import DataRow fro
type SpecsProps = {
  matrix: any;
  mission: any;
};

function Specs(props: SpecsProps) {
  console.log({ props });
  const [data, setData] = useState<any>();
  useEffect(() => {
    let castumerIndex = props.matrix.mainMatrix.AccountKey.indexOf(props.mission["מפתח"]);
    let cellsData = props.matrix.mainMatrix.cellsData;
    let itemsNames: any = props.matrix.mainMatrix.itemsNames;
    console.log({ itemsNames });
    let record: any = {};
    let details = [];
    for (let i = 0; i <= cellsData[castumerIndex].length - 1; i++) {
      record = {};
      if (cellsData[castumerIndex][i] != 0) {
        record["פריט"] = itemsNames[i];
        record["כמות"] = cellsData[castumerIndex][i];
        record["isDone"] = false;
        console.log({ record });
        details.push(record);
      }
    }
    record && setData(details);
  }, []);

  const handleChange = (e: any, p?: any) => {
    console.log({ e, p });
    if (e.target.id == "isDone") {
      let rowIndex = 0;
      let newData = data.map((row: any, idx: number) => {
        if (row["פריט"] == p["פריט"]) {
          rowIndex = idx;
          return { ...row, isDone: !row["isDone"] };
        } else return row;
      });

      let sortedData: any = [];
      newData.forEach((row: object, i: number) => {
        if (i != rowIndex) {
          sortedData.push(row);
          console.log({ sortedData });
        }
      });
      newData[rowIndex]["isDone"] == true ? sortedData.push(newData[rowIndex]) : sortedData.unshift(newData[rowIndex]);
      setData([...sortedData]);
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
              <td className="td">הוסף</td>
              <td className="td">החסר</td>
              <td className="td">סופק</td>
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
                      <td key={ci + idx} className="td">
                        {cell}
                      </td>
                    )
                )}
                <td
                  id="add"
                  className="text-xl text-center bg-green-100 hover:bg-green-500"
                  onClick={() => {
                    setData([
                      ...data.map((row: any, i: number) => (i == idx ? { ...row, כמות: row["כמות"] + 1 } : row)),
                    ]);
                  }}
                >
                  +
                </td>
                <td
                  id="sub"
                  className="text-xl text-center bg-red-100 hover:bg-red-500"
                  onClick={() => {
                    setData([
                      ...data.map((row: any, i: number) => (i == idx ? { ...row, כמות: row["כמות"] - 1 } : row)),
                    ]);
                  }}
                >
                  -
                </td>
                <td>
                  <input id="isDone" type={"checkbox"} onChange={(e) => handleChange(e, row)} checked={row["isDone"]} />
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

export default Specs;

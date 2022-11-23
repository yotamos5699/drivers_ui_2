import React, { useEffect, useState } from "react";
import { DataRow } from "./Table";
//import DataRow fro
type SpecsProps = {
  matrix: any;
  mission: any;
};

function Specs(props: SpecsProps) {
  const [data, setData] = useState([
    { pp: 11, sss: 22, hh: 44 },
    { pp: 312, sss: 242, hh: 442 },
    { pp: 312, sss: 2212, hh: 442 },
  ]);
  useEffect(() => {
    let castumerIndex = props.matrix.mainMatrix.AccountKey.indexOf(props.mission["מפתח"]);
    let cellsData = props.matrix.mainMatrix.cellsData;
    let itemsNames: any = props.matrix.mainMatrix.itemsNames;
    console.log({ itemsNames });
    let record: any = {};
    let details = [];
    for (let i = 0; i <= cellsData[castumerIndex].length - 1; i++) {
      if (cellsData[castumerIndex][i] != 0) {
        record["פריט"] = itemsNames[i];
        record["כמות"] = cellsData[castumerIndex][i];
        console.log({ record });
        details.push(record);
      }
    }
    record && setData(details);
  }, []);

  return (
    <div>
      {data && (
        <table>
          <thead className="bg-white border-b">
            <tr className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
              {Object.keys(data[0]).map((header, idx) => (
                <td className="td" key={idx + 1111}>
                  {header}
                </td>
              ))}
              <td className="td">סופק</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row: any, idx: number) => (
              <tr className="tr">
                {Object.values(row).map((cell: any) => (
                  <td className="td">{cell}</td>
                ))}
                <td className="td">
                  <input type={"checkbox"} className=""></input>
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

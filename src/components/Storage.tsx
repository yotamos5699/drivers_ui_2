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
  useEffect(() => {
    let AccountKeys = props.matrix.mainMatrix.AccountKey;
    let AccountNames = AccountKeys.map((Account: any) => {
      let card: any[] = props.castumers.filter(
        (cas: any) => cas["מפתח"] == Account
      );
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
    console.log({ itemsNames });
    let details = [];
    try {
      for (let i = 0; i <= AccountKeys.length - 1; i++) {
        record = {};
        record[itemsNames[0]] = AccountNames[i];
        for (let j = 1; j <= itemsNames.length - 1; j++) {
          console.log("cells data error ", cellsData[i][j - 1]);
          record[itemsNames[j]] = cellsData[i][j - 1];
        }
        details.push(record);
        console.log({ details, record });
      }
    } catch (err) {
      console.log(err);
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
      newData[rowIndex]["isDone"] == true
        ? sortedData.push(newData[rowIndex])
        : sortedData.unshift(newData[rowIndex]);
      setData([...sortedData]);
    }
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
              <tr
                key={idx + 3434}
                className={row["isDone"] == false ? "tr" : "tr bg-gray-200"}
                onClick={(e) => handleChange(e, row)}
              >
                {Object.values(row).map((cell: any, ci) => (
                  <td key={ci + idx} className="td">
                    {cell}
                  </td>
                ))}
                <td>
                  <input
                    id="isDone"
                    type={"checkbox"}
                    onChange={(e) => handleChange(e, row)}
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

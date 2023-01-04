import React, { useEffect, useState } from "react";
import { renderScreen, updateResponseDB } from "../helper";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";
import Pay from "./Pay";
import Returns from "./Returns";
import { useQuery } from "@tanstack/react-query";
import { fetchMessageData, fetchMessagesData } from "../api";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
//import DataRow fro
type SpecsProps = {
  matrix: any;
  mission: any;
  handleGlobalRender: any;
};

function Specs(props: SpecsProps) {
  console.log("specs props ", { props });
  const [data, setData] = useState<any>();
  const [msg, setMessage] = useState(null);
  const [render, setReder] = useState({
    main: true,
    pay: false,
    ret: false,
  });
  useEffect(() => {
    // const STORED = localStorage.getItem("specData");
    // if (STORED != "undefined" && STORED != null) return setData([...JSON.parse(STORED)]);

    let castumerIndex = props.matrix.mainMatrix.AccountKey.indexOf(props.mission["מפתח"]);
    let cellsData = props.matrix.mainMatrix.cellsData;
    let itemsNames: any = props.matrix.mainMatrix.itemsNames;
    //  console.log({ itemsNames });
    let msg = props?.matrix?.changesMatrix?.metaData[castumerIndex]?.Details;
    msg && setMessage(msg);
    let record: any = {};
    let details = [];
    const addOne = itemsNames[0] == "לקוח" ? 1 : 0;
    for (let i = 0; i <= cellsData[castumerIndex].length - 1; i++) {
      record = {};
      if (cellsData[castumerIndex][i] != 0) {
        record["פריט"] = itemsNames[i + addOne];
        record["כמות"] = cellsData[castumerIndex][i];
        record["isDone"] = false;
        // console.log({ record });
        details.push(record);
      }
    }
    record && setData(details);
  }, []);

  const msg2 = useQuery({
    queryKey: ["msg2"],
    queryFn: () => fetchMessageData(props.mission),
  });

  // const msg2 = useQuery({
  //   queryKey: ["msg2"],
  //   queryFn: () => fetchMessagesData(),
  // });

  useEffect(() => {
    if (data) localStorage.setItem("specData", JSON.stringify(data));
  }, [data]);

  const handleChange = (e: any, p?: any) => {
    // console.log({ e, p });
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
          // console.log({ sortedData });
        }
      });
      newData[rowIndex]["isDone"] == true ? sortedData.push(newData[rowIndex]) : sortedData.unshift(newData[rowIndex]);
      setData([...sortedData]);
    }
  };

  const handleClick = (e: any, data?: any) => {
    if (e.target.id == "main" && e.target?.name == "summery") {
      updateResponseDB(data, "payments", "סיכום", props.mission);
      console.log('updateResponseDB(data,payment,"מזומן",props.mission)', { data, e });
    }
    if (e.target.id == "main" && e.target?.name == "cash") {
      updateResponseDB(data, "payments", "מזומן", props.mission);
      console.log('updateResponseDB(data,payment,"מזומן",props.mission)', { data, e });
    }
    if (e.target.id == "main" && e.target?.name == "check") {
      updateResponseDB(data, "payments", "שיק", props.mission);
      console.log('updateResponseDB(data,payment,"שיק",props.mission)', { data, e });
    }
    if (e.target.id == "main" && e.target.name == "sub") {
      updateResponseDB(
        {
          list: data.list,
        },
        "returns",
        "",
        props.mission
      );
    }
    console.log({ e, data });
    setReder((prev: any) => {
      let data = prev;

      Object.keys(prev).forEach((Key: string) => {
        if (Key === e.target.id) {
          data[Key] = true;
        } else {
          data[Key] = false;
        }
      });
      console.log("render in specs ", { data });
      return { ...data };
    });
  };
  return (
    <div className="mt-20 w-full">
      {msg && (
        <div className="flex w-screen h-1/6 text-white bg-red-600">
          <p className="w-2/12 text-xl"> הודעה ממטריצה </p>
          <p className="w-10/12">{msg}</p>
        </div>
      )}

      <div className="flex w-screen h-1/6 text-white bg-red-600">
        <p className="w-2/12 text-xl"> הודעת מנהל </p>
        {msg2.isLoading ? (
          <p className="w-10/12">טוען ......</p>
        ) : msg2.error ? (
          <p>תקלה בטעינה....</p>
        ) : (
          msg2.data && <p>{JSON.stringify(msg2?.data?.data?.content ? msg2.data.data.content : msg2.data.data)}</p>
        )}
      </div>

      {data && render.main && (
        <div className="">
          <table>
            <thead className=" bg-white border-b">
              <tr
                key={"asd"}
                className=" text-sm font-medium text-gray-900 px-6 py-4 text-center  items-center w-full bg-gray- shadow-md rounded-md gap-1 touch-none"
              >
                {Object.keys(data[0]).map(
                  (header, idx) =>
                    header != "isDone" && (
                      <td className="td2" key={idx + 1111}>
                        {header}
                      </td>
                    )
                )}
                <td className="td2">הוסף</td>
                <td className="td2">החסר</td>
                <td className="td2">סופק</td>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, idx: number) => (
                <tr
                  key={idx + 3434}
                  className={
                    row["isDone"] == false
                      ? "text-sm font-medium text-gray-900 px-6 py-4 text-center  items-center w-4/5 bg-gray- shadow-md rounded-md gap-1 touch-none"
                      : "text-sm bg-gray-200  text-gray-900 px-6 py-4 text-center  items-center w-4/5  shadow-md rounded-md gap-1 touch-none"
                  }
                  onClick={(e) => handleChange(e, row)}
                >
                  {Object.values(row).map(
                    (cell: any, ci) =>
                      Object.keys(row)[ci] != "isDone" && (
                        <td key={ci + idx} className="td2">
                          {cell}
                        </td>
                      )
                  )}
                  <td
                    id="add"
                    className="td2 text-xl text-center bg-green-100 hover:bg-green-500"
                    onClick={() => {
                      setData([
                        ...data.map((row: any, i: number) => (i == idx ? { ...row, כמות: row["כמות"] + 1 } : row)),
                      ]);
                    }}
                  >
                    <GrAddCircle className="icn1" />
                  </td>
                  <td
                    id="sub"
                    className="td2 text-xl text-center bg-red-100 hover:bg-red-500"
                    onClick={() => {
                      setData([
                        ...data.map((row: any, i: number) => (i == idx ? { ...row, כמות: row["כמות"] - 1 } : row)),
                      ]);
                    }}
                  >
                    <GrSubtractCircle className="icn1" />
                  </td>
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
          <button
            id="table"
            onClick={props.handleGlobalRender}
            className={data?.filter((row: any) => row.isDone === false).length === 0 ? "btn1 bg-green-600" : "btn1"}
          >
            {data?.filter((row: any) => row.isDone === false).length === 0 ? "סיום" : "חזור"}
          </button>
          <button id="ret" onClick={handleClick} className="btn1">
            החזרת סחורה
          </button>
          {data?.filter((row: any) => row.isDone === false).length === 0 && (
            <div className="flex">
              <button id="pay" onClick={handleClick} className="btn1">
                תשלום
              </button>
              <button id="pay" onClick={handleClick} className="btn1">
                חתימה
              </button>
            </div>
          )}
        </div>
      )}
      {render.ret && <Returns handleClick={handleClick} />}
      {render.pay && <Pay handleClick={handleClick} />}
    </div>
  );
}

export default Specs;

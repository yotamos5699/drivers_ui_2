import { useState } from "react";
import { driver } from "../typing";
import Specs from "./Specs";
import Table from "./Table";

type DashBoardProps = {
  user: driver | undefined;
  matrix?: any;
  castumers?: object[];
};

function DashBoard(props: DashBoardProps) {
  const [missions, setMissions] = useState<object[]>();
  const [mission, setCurrentMission] = useState<any>();
  const [render, setRender] = useState({
    details: false,
    table: true,
  });
  const handleRowClick = async (key: any, p: any) => {
    console.log(props.matrix.mainMatrix);
    let spec: object[] | any = await props.castumers?.filter((castumer: any, idx) => {
      if (p.row["נייד"] == castumer["טלפון נייד"]) {
        console.log({ castumer });
        return castumer;
      }
    });
    if (spec?.length > 0) {
      setRender((prev) => ({ ...prev, details: !prev.details, table: !prev.table }));
    }
    setCurrentMission(spec[0]);

    console.log({ spec });
  };

  const handleClick = async (e: any) => {
    if (e.target.name == "back_to_table") {
      setRender((prev) => ({ ...prev, details: !prev.details, table: !prev.table }));
    }
    console.log(e);
    let tasks = await constractMissions(props.matrix, props.castumers);
    setMissions(tasks);
  };
  const getCurrentAccountKeys = (keysArrey: any, userKey: any) => {
    return keysArrey;
  };

  const constractMissions = async (matrixData: any, castumers: any) => {
    console.log({ matrixData });
    let currentCasumersKeys = getCurrentAccountKeys(matrixData.mainMatrix.AccountKey, props.user?.pivotKey);
    let items = matrixData.itemsNames;
    let thisCastumer: any[] = [];
    let missionsArray: object[] = [];
    for (let i = 0; i <= currentCasumersKeys.length - 1; i++) {
      //console.log("current cas key", currentCasumersKeys[i]);

      thisCastumer = await castumers.filter((castumer: any) => {
        //  console.log({ thisCastumer });
        // console.log("מפתח לקוח", castumer["מפתח"]);
        return castumer["מפתח"] == currentCasumersKeys[i].toString();
      });
      if (thisCastumer?.length) {
        let record = {
          שם: thisCastumer[0]["שם חשבון"],
          כתובת: thisCastumer[0]["כתובת"],
          נייד: thisCastumer[0]["טלפון נייד"],
          חוב: thisCastumer[0]["יתרת חשבון"],
        };
        missionsArray.push(record);
      }
    }

    return missionsArray;
  };

  return (
    <div className="flex flex-col">
      <div className="flex  items-top justify-top  bg-white shadow-md rounded px-4 ">
        <h2>שלום {props?.user?.name}</h2>
        <div></div>
        <button
          name="password_btn"
          onClick={handleClick}
          className="w-max-7 bg-blue-500 hover:bg-blue-400 text-white font-bold border rounded w-full py-2 px-3 border-blue-700 hover:border-blue-500"
          placeholder="Username"
        >
          המשימות שלך
        </button>
        {render.details && (
          <button
            name="back_to_table"
            onClick={handleClick}
            className="w-max-7 bg-blue-500 hover:bg-blue-400 text-white font-bold border rounded w-full py-2 px-3 border-blue-700 hover:border-blue-500"
            placeholder="Username"
          >
            חזור
          </button>
        )}
      </div>
      {render.table && <Table missions={missions} handleClick={handleRowClick} />}

      {mission && render.details && <Specs matrix={props.matrix} mission={mission} />}
      {/* <h1>meta data מטריצה</h1>
      <div>{JSON.stringify(missions)}</div>
      <h1>לקוחות</h1>
      <div>{props.castumers ? JSON.stringify(props.castumers[0]) : "error blaaat"}</div> */}
    </div>
    // Provide the client to your App
  );
}

export default DashBoard;

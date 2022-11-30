import { useEffect, useState } from "react";
import { driver } from "../typing";
import Specs from "./Specs";
import Table from "./Table";
import Storage from "./Storage";
type DashBoardProps = {
  user: driver | undefined;
  matrix?: any;
  castumers?: object[];
};

const getCurrentAccountKeys = (keysArrey: any, userKey: any) => {
  return keysArrey;
};

const sortTableData = async (missions: any[], Midx: number) => {
  let a = [];
  missions.forEach((m: any, i: number) => {
    if (i != Midx) a.push(m);
  });
  if (missions[Midx]["isDone"] == true) {
    a.push(missions[Midx]);
    console.log("in sort table push ", { a, missions });
    return a;
  } else {
    a.unshift(missions[Midx]);
    console.log("in sort table unshift ", { a, missions });
    return a;
  }
};

function DashBoard(props: DashBoardProps) {
  const [missions, setMissions] = useState<any>();
  const [currentMission, setCurrentMission] = useState<any>();

  const [render, setRender] = useState<any>({
    details: false,
    table: true,
    nav: false,
    pay: false,
    isDone: false,
    log: false,
  });

  useEffect(() => {
    const STORED = window.localStorage.getItem("missions");
    if (STORED != "undefined" && STORED != null) setMissions([...JSON.parse(STORED)]);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("missions", JSON.stringify(missions));
  }, [missions]);

  const handleRowClick = async (e: any, p: any) => {
    let cellId = e.target.id;

    console.log({ cellId });
    let spec: object[] | any = props.castumers?.filter((castumer: any) => {
      if (p.row["נייד"] == castumer["טלפון נייד"]) {
        // console.log({ p, e });
        return castumer;
      }
    });

    if (cellId == "isDone") {
      let rowIndex: number = 0;
      let nArray = missions.map((m: any, midx: number) => {
        if (p.row["נייד"] == m["נייד"]) {
          console.log("data in p.row ", p.row, "data in m ", m);
          rowIndex = midx;
          return { ...m, isDone: !m.isDone };
        } else return m;
      });

      let newd = await sortTableData(nArray, rowIndex);

      setMissions([...newd]);
    }

    if (spec?.length > 0 && cellId != "" && cellId != "isDone") {
      console.log("before set current mission ", spec);
      setCurrentMission(spec[0]);
      setRender({ ...renderScreen(cellId) });
    }
  };

  const renderScreen = (cellId: string) => {
    console.log("in render screen ", render);
    let r: any = {};
    Object.keys(render).forEach((key) => (key == cellId ? (r[key] = true) : (r[key] = false)));
    console.log({ r });
    return r;
  };

  const handleHeaderClick = async (e: any) => {
    console.log("id in handle click ", e.target.id);
    e.target.id == "table" && setRender({ ...renderScreen(e.target.id) });
    e.target.id == "log" && setRender({ ...renderScreen(e.target.id) });
    console.log({ props });
    if (!missions) {
      let tasks = await constractMissions(props.matrix, props.castumers);
      setMissions(tasks);
    }
  };

  const constractMissions = async (matrixData: any, castumers: any) => {
    console.log({ matrixData });
    let currentCasumersKeys = getCurrentAccountKeys(matrixData.mainMatrix.AccountKey, props.user?.pivotKey);

    let thisCastumer: any[] = [];
    let missionsArray: object[] = [];

    for (let i = 0; i <= currentCasumersKeys.length - 1; i++) {
      thisCastumer = await castumers.filter((castumer: any) => {
        return castumer["מפתח"] == currentCasumersKeys[i].toString();
      });
      if (thisCastumer?.length) {
        console.log("resets missions !!!");
        let record = {
          שם: thisCastumer[0]["שם חשבון"],
          כתובת: thisCastumer[0]["כתובת"],
          נייד: thisCastumer[0]["טלפון נייד"],
          חוב: thisCastumer[0]["יתרת חשבון"],

          isDone: false,
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
          onClick={handleHeaderClick}
          className="w-max-7 bg-blue-500 hover:bg-blue-400 text-white font-bold border rounded w-full py-2 px-3 border-blue-700 hover:border-blue-500"
          placeholder="Username"
        >
          המשימות שלך
        </button>
        <button
          id="log"
          onClick={handleHeaderClick}
          className="w-max-7 bg-blue-500 hover:bg-blue-400 text-white font-bold border rounded w-full py-2 px-3 border-blue-700 hover:border-blue-500"
          placeholder="Username"
        >
          מחסן
        </button>
        {!render.table && (
          <button
            id="table"
            onClick={handleHeaderClick}
            className="w-max-7 bg-blue-500 hover:bg-blue-400 text-white font-bold border rounded w-full py-2 px-3 border-blue-700 hover:border-blue-500"
            placeholder="Username"
          >
            חזור
          </button>
        )}
      </div>
      {render.table && missions && <Table missions={missions} handleClick={handleRowClick} />}

      {render.details && <Specs matrix={props.matrix} mission={currentMission} />}
      {render.log && <Storage matrix={props.matrix} mission={currentMission} castumers={props.castumers} />}
      {/* <h1>meta data מטריצה</h1>
      <div>{JSON.stringify(missions)}</div>
      <h1>לקוחות</h1>
      <div>{props.castumers ? JSON.stringify(props.castumers[0]) : "error blaaat"}</div> */}
    </div>
    // Provide the client to your App
  );
}

export default DashBoard;

import { useState } from "react";
import { driver } from "../typing";
import Specs from "./Specs";
import Storage from "./Storage";
import Header from "./Header";
import { constractMissions, renderScreen, sortTableData } from "../helper";
import Missions from "./Missions";

type DashBoardProps = {
  user: driver | undefined;
  matrix?: any;
  castumers?: object[];
};

function Nav(props: DashBoardProps) {
  const [missions, setMissions] = useState<any>(constractMissions(props.matrix, props.castumers));
  const [currentMission, setCurrentMission] = useState<any>();

  const [render, setRender] = useState<any>({
    details: false,
    table: false,
    nav: false,
    pay: false,
    isDone: false,
    storage: true,
  });

  const handleRowClick = async (e: any, p: any) => {
    let cellId = e.target.id;

    console.log({ cellId });
    let spec: object[] | any = props.castumers?.filter((castumer: any) => {
      if (p.row["נייד"] == castumer["טלפון נייד"]) {
        // console.log({ p, e });
        return castumer;
      }
    });

    let { nArray, rowIndex } = updateStatus(cellId, p, missions);
    let newd = await sortTableData(nArray, rowIndex);
    setMissions([...newd]);

    if (spec?.length > 0 && cellId != "" && cellId != "isDone") {
      console.log("before set current mission ", spec);
      setCurrentMission(spec[0]);
      setRender({ ...renderScreen(cellId, render) });
    }
  };
  const updateStatus = (cellId: string, p: any, missions: any) => {
    let nArray = [],
      rowIndex = 0;
    if (cellId == "isDone") {
      nArray = missions.map((m: any, midx: number) => {
        if (p.row["נייד"] == m["נייד"]) {
          console.log("data in p.row ", p.row, "data in m ", m);
          rowIndex = midx;
          return { ...m, isDone: !m.isDone };
        } else return m;
      });
    }
    return { nArray, rowIndex };
  };

  const handleGlobalRender = async (e: any) => {
    console.log("id in handle click ", e.target.id);
    if (e.target.id === "stockReady") setRender({ ...renderScreen("table", render) });
    e.target.id == "table" && setRender({ ...renderScreen(e.target.id, render) });
    e.target.id == "log" && setRender({ ...renderScreen(e.target.id, render) });
    console.log({ props });
    if (!missions) {
      let tasks = await constractMissions(props.matrix, props.castumers);
      setMissions(tasks);
    }
  };

  return (
    <div className="flex flex-col">
      <Header render={render} user={props.user} />
      {render.table && missions && Array.isArray(missions) ? (
        <Missions missions={missions} handleClick={handleRowClick} />
      ) : (
        <h1>loading...</h1>
      )}

      {render.details && (
        <Specs matrix={props.matrix} mission={currentMission} handleGlobalRender={handleGlobalRender} />
      )}
      {render.storage && (
        <Storage
          matrix={props.matrix}
          mission={currentMission}
          castumers={props.castumers}
          handleGlobalRender={handleGlobalRender}
        />
      )}
      {/* <h1>meta data מטריצה</h1>
      <div>{JSON.stringify(missions)}</div>
      <h1>לקוחות</h1>
      <div>{props.castumers ? JSON.stringify(props.castumers[0]) : "error blaaat"}</div> */}
    </div>
    // Provide the client to your App
  );
}

export default Nav;

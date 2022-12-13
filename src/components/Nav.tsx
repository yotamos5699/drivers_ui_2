import { useState } from "react";
import { driver, Tasks } from "../typing";
import Specs from "./Specs";
import Storage from "./Storage";
import Header from "./Header";
import { constractMissions, renderScreen } from "../helper";
import Missions from "./Missions";

type DashBoardProps = {
  driver: string | number;
  user: driver | undefined;
  matrix?: any;
  castumers?: object[];
};

function Nav(props: DashBoardProps) {
  const [missions, setMissions] = useState<Tasks>(
    constractMissions(props.matrix, props.castumers, props.driver)
  );
  const [currentMission, setCurrentMission] = useState<any>();

  const [render, setRender] = useState<any>({
    details: false,
    table: false,
    nav: false,
    pay: false,
    isDone: false,
    storage: true,
  });

  const handleRowClick = async (e: any) => {
    const MissionID = e?.active?.id ? e.active.id : null;
    const cellId = e.activatorEvent?.target?.id;

    if (MissionID)
      useNavActions(
        { type: cellId, payload: { MissionID: MissionID, cellId: cellId } },
        props,
        setCurrentMission
      );
  };

  const handleGlobalRender = async (e: any) => {
    useRendererActions({ type: e.target.id }, render, renderScreen, setRender);
    if (!missions) {
      let tasks: Tasks = constractMissions(
        props.matrix,
        props.castumers,
        props.driver
      );
      setMissions(tasks);
    }
  };

  return (
    <div className="flex flex-col border-4 border-red-500">
      <Header render={render} user={props.user} />
      {render.table && missions.missions && Array.isArray(missions.missions) ? (
        <Missions
          missions={missions.missions}
          handleClick={handleRowClick}
          handleGlobalRender={handleGlobalRender}
        />
      ) : (
        <h1>loading...</h1>
      )}

      {render.details && currentMission && (
        <Specs
          matrix={props.matrix}
          mission={currentMission}
          handleGlobalRender={handleGlobalRender}
        />
      )}
      {render.storage && missions?.missions?.length > 0 ? (
        <Storage
          matrix={props.matrix}
          mission={currentMission}
          castumers={props.castumers}
          handleGlobalRender={handleGlobalRender}
          filterdKeys={missions.filterdKeys}
        />
      ) : (
        render.storage && (
          <h1
            className={
              "text-center text-9xl justify-center border-4 border-red-500"
            }
          >
            אין משימות לנהג
          </h1>
        )
      )}
    </div>
  );
}

export default Nav;

type UseRender = {
  type: string;
};

export const useRendererActions = (
  action: UseRender,
  render: any,
  renderScreen: any,
  setRender: any
) => {
  switch (action.type) {
    case "stockReady":
      setRender({ ...renderScreen("table", render) });
      return console.log("rendered ", { action });
    case "table":
      setRender({ ...renderScreen("table", render) });
      return console.log("rendered ", { action });
    case "log":
      setRender({ ...renderScreen("log", render) });
      return console.log("rendered ", { action });
    case "details":
      setRender({ ...renderScreen("details", render) });
      return console.log("rendered ", { action });

    default:
      return console.log("no screen to render", { action });
  }
};

export const useNavActions = (action: any, props: any, seter: any) => {
  switch (action.type) {
    case "details":
      let spec: object[] | any = props.castumers?.filter((castumer: any) => {
        if (action.payload.MissionID == castumer["מפתח"]) {
          return castumer;
        }
      });

      if (spec?.length) {
        console.log("before set current mission ", spec);
        seter(spec[0]);
        return console.log("current mission ok");
      }
      return console.log("current doesnt exist");
  }
};

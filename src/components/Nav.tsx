import { useState, useContext, useEffect } from "react";
import { driver, Tasks } from "../typing";
import Specs from "./Specs";
import Storage from "./Storage";
import Header from "./Header";
import { backToLogin, constractMissions, renderScreen, useInitializedState } from "../helper";
import Missions from "./Missions";

type DashBoardProps = {
  driver: string | number;
  user: driver | undefined;
  matrix?: any;
  castumers?: object[];
  loginShow: any;
};

const defaultRender = {
  details: false,
  table: false,
  nav: false,
  pay: false,
  isDone: false,
  storage: true,
};

function Nav(props: DashBoardProps) {
  const [missions, setMissions] = useState<Tasks>(constractMissions(props.matrix, props.castumers, props.driver));
  const [currentMission, setCurrentMission] = useState<any>();
  const [toShow, setToShow] = useState<any>();
  const [render, setRender] = useState<any>();
  const [currentScreen, setCurrentScreen] = useState(null);
  console.log("nav props", { props });
  useEffect(() => {
    let ls = window.localStorage.getItem("render");

    if (ls != "undefined" && ls != null) {
      let D = JSON.parse(ls);
      //   console.log("in nav render check", { D });
      setRender({ ...D });
      setToShow(D.storage);
      return;
    }
    //   console.log("after nav render");
    return setRender({ ...defaultRender });
  }, []);

  useEffect(() => {
    if (toShow) window.localStorage.setItem("storage", JSON.stringify(toShow));
  }, [toShow]);

  useEffect(() => {
    //  console.log(render);
    if (missions) window.localStorage.setItem("missions", JSON.stringify(missions));
    if ((render && currentScreen == "stockReady") || currentScreen == "table" || currentScreen == "storage")
      window.localStorage.setItem("render", JSON.stringify(render));
  }, [render, missions]);

  useEffect(() => {
    async function fetchStorage() {
      let res = await useInitializedState("storage");
      if (res != "undefined" && res != null) {
        setToShow(res);
      }
    }
    fetchStorage();
  }, []);

  useEffect(() => {}, []);
  const handleRowClick = async (e: any) => {
    const MissionID = e?.active?.id ? e.active.id : null;
    const cellId = e.activatorEvent?.target?.id;
    MissionID &&
      useNavActions({ type: cellId, payload: { MissionID: MissionID, cellId: cellId } }, props, setCurrentMission);
  };

  const handleGlobalRender = async (e: any) => {
    setCurrentScreen(e.target.id);
    useRendererActions({ type: e.target.id }, render, renderScreen, setRender, setToShow);
    if (!missions) {
      let tasks: Tasks = constractMissions(props.matrix, props.castumers, props.driver);
      setMissions(tasks);
    }
  };

  const handleClick = () => {
    backToLogin(props.loginShow);
  };
  return (
    <div className="flex flex-col border-4 border-red-500">
      <Header render={render} user={props.user} loginShow={props.loginShow} />
      {render?.table ? (
        <Missions missions={missions.missions} handleClick={handleRowClick} handleGlobalRender={handleGlobalRender} />
      ) : (
        <h1>loading...</h1>
      )}

      {render?.details && currentMission && (
        <Specs matrix={props.matrix} mission={currentMission} handleGlobalRender={handleGlobalRender} />
      )}
      {render?.storage && missions?.missions?.length > 0 && toShow ? (
        <Storage
          matrix={props.matrix}
          mission={currentMission}
          castumers={props.castumers}
          handleGlobalRender={handleGlobalRender}
          filterdKeys={missions.filterdKeys}
        />
      ) : (
        render?.storage &&
        toShow && (
          <div>
            <h1 className={"text-center text-9xl justify-center border-4 border-red-500"}>אין משימות לנהג</h1>
            <button id={"backToLogin"} className="btn1" onClick={handleClick}>
              חזור
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default Nav;

type UseRender = {
  type: string;
};

export const useRendererActions = (action: UseRender, render: any, renderScreen: any, setRender: any, func?: any) => {
  switch (action.type) {
    case "stockReady":
      window.localStorage.setItem("storage", "false");
      func(false);
      window.localStorage.setItem("render", JSON.stringify(render));
      setRender({ ...renderScreen("table", render) });
      return console.log("rendered ", { action });
    case "table":
      window.localStorage.setItem("render", JSON.stringify(render));
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

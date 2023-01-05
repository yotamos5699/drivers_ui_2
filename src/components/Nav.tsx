import { useEffect, useState } from "react";
import { driver, Tasks } from "../typing";
import Specs from "./Specs";
import Storage from "./Storage";
import Header from "./Header";
import { backToLogin, constractMissions, Logger, renderScreen } from "../helper";
import Missions from "./Missions";
import useLocalStorage from "../Hooks/useLocalStorage";
import CarPairing from "./CarPairing";

type DashBoardProps = {
  driver: string | number;
  user: driver;
  matrix?: any;
  castumers?: object[];
  // loginShow: any;
  render: any;
  setRender: any;
};

function Nav(props: DashBoardProps) {
  console.log("nav props HHHH", { props });
  const [missions, setMissions] = useLocalStorage("missions", {
    data: constractMissions(props.matrix, props.castumers, props.driver),
  });
  const [storageHeaders, setStorageHeaders] = useLocalStorage("storageHeaders", { data: { headers: null, amount: 0 } });
  const [currentMission, setCurrentMission] = useState<any>();
  const [isPaired, setIsPaired] = useLocalStorage("isPaired", { data: false });
  const [movment, setMovment] = useLocalStorage("movment", { data: false });
  useEffect(() => {}, [missions.data]);
  const [currentScreen, setCurrentScreen] = useState(null);

  const handleRowClick = async (e: any) => {
    const MissionID = e?.active?.id ? e.active.id : null;
    const cellId = e.activatorEvent?.target?.id;
    MissionID &&
      useNavActions({ type: cellId, payload: { MissionID: MissionID, cellId: cellId } }, props, setCurrentMission);
  };

  const handleGlobalRender = async (e: any) => {
    setCurrentScreen(e.target.id);
    useRendererActions({ type: e.target.id }, props.render, renderScreen, props.setRender);
    if (!missions) {
      let tasks: Tasks = constractMissions(props.matrix, props.castumers, props.driver);
      setMissions(tasks);
    }
  };

  Logger(storageHeaders, "  Logger(storageHeaders");

  return (
    <div className="flex flex-col w-full border-4 border-red-500">
      {!isPaired.data && <CarPairing setIsPaired={setIsPaired} driver={props.user} />}
      {!props.render.data.admin && isPaired.data && (
        <Header
          currentMission={currentMission}
          setMovment={setMovment}
          movment={movment}
          render={props.render}
          user={props.user}
          setRender={props.setRender}
          storageHeaders={storageHeaders}
        />
      )}
      {props.render?.data?.table && missions?.data?.missions && (
        <Missions
          driver={props.driver}
          movment={movment}
          missions={missions?.data?.missions}
          handleClick={handleRowClick}
          handleGlobalRender={handleGlobalRender}
          setReder={props.setRender}
          render={props.render}
          mission={currentMission}
        />
      )}

      {props.render?.data?.details && currentMission && (
        <Specs matrix={props.matrix} mission={currentMission} handleGlobalRender={handleGlobalRender} />
      )}
      {props.render?.data?.storage && isPaired.data && missions?.data?.missions?.length > 0 ? (
        <Storage
          setStorageHeaders={setStorageHeaders}
          matrix={props.matrix}
          mission={currentMission}
          castumers={props.castumers}
          handleGlobalRender={handleGlobalRender}
          filterdKeys={missions.data.filterdKeys}
        />
      ) : (
        props.render?.data?.storage &&
        isPaired.data &&
        missions?.data && (
          <div>
            <h1 className={"mt-24 text-center text-9xl justify-center border-4 border-red-500"}>אין משימות לנהג</h1>
            <button id={"backToLogin"} className="btn1" onClick={() => backToLogin(props.setRender, props.render.data)}>
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
      // localStorage.setItem("render", JSON.stringify(render));
      setRender({ ...renderScreen("table", render.data) });

      return;
    case "table":
      //  localStorage.setItem("render", JSON.stringify(render));
      setRender({ ...renderScreen("table", render.data) });
      return;
    case "log":
      setRender({ ...renderScreen("log", render.data) });
      return;
    case "details":
      setRender({ ...renderScreen("details", render.data) });
      return;

    default:
      return;
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
        seter(spec[0]);
        return;
      }
      return;
  }
};

// const useRenderState = (toShow: any, missions: any, render: any, currentScreen: any) => {
//   useEffect(() => {
//     if (toShow) localStorage.setItem("storage", JSON.stringify(toShow));
//   }, [toShow]);

//   useEffect(() => {
//     //  console.log(render);
//     if (missions) localStorage.setItem("missions", JSON.stringify(missions));
//     if ((render && currentScreen == "stockReady") || currentScreen == "table" || currentScreen == "storage")
//       localStorage.setItem("render", JSON.stringify(render));
//   }, [render, missions]);
// };

// const useCheckInitialData = (setToShow: any) => {
//   useEffect(() => {
//     async function fetchStorage() {
//       let res = await useInitializedState("storage");
//       if (res != "undefined" && res != null) {
//         setToShow(res);
//       }
//     }
//     fetchStorage();
//   }, []);
// };

// const useCheckRenderStorageData = (setRender: any, setToShow: any) => {
//   useEffect(() => {
//     let localStorageRenderData = localStorage.getItem("render");
//     if (localStorageRenderData != "undefined" && localStorageRenderData != null) {
//       let Data = JSON.parse(localStorageRenderData);
//       //   console.log("in nav render check", { D });
//       setRender({ ...Data });
//       setToShow(Data.storage);
//       return;
//     }
//     //   console.log("after nav render");
//     return setRender({ ...defaultRender });
//   }, []);
// };

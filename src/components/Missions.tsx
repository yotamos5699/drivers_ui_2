import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DataRow from "./DataRow";
import { missionsReducer, useInitializedState } from "../helper";
import useLocalStorage from "../Hooks/useLocalStorage";
import Model from "./Model";
import Summery from "./Summery";

export default function Missions(props: any) {
  console.log({ props });
  console.log("render in misssions ", props.render);
  const [allFinished, setAllFinished] = useState(false);
  const [sumRout, setSumRout] = useState(false);
  const [tableData, dispatch] = useReducer(missionsReducer, () => {
    const res = localStorage.getItem("missions");
    if (res !== null) return JSON.parse(res);
    else return { data: null, startIndex: 0, endIndex: 0 };
  });

  useEffect(() => {
    console.log("mennage animate ");
  }, [props.movment.data]);

  const sensor = [useSensor(PointerSensor)];

  const [td, setTd] = useState<any[]>();
  useEffect(() => {
    async function fetchStorage() {
      let res = await useInitializedState("missions", props);

      dispatch({
        type: "init",
        payload: { data: props?.missions ? props?.missions : res.data.data },
      });
    }

    fetchStorage();
  }, []);
  async () => await useInitializedState("", props);
  useEffect(() => {
    if (tableData?.data) {
      localStorage.setItem("missions", JSON.stringify(tableData));
      setTd([...tableData.data]);
      setAllFinished(() => {
        if (tableData.data.filter((row: any) => row.isDone === false)[0]) {
          return false;
        } else return true;
      });
    }
  }, [tableData.data]);

  const handleDragEnd = (e: any) => {
    const nativeEvent = e.activatorEvent?.target?.id
      ? e.activatorEvent.target.id
      : null;

    if (!isNaN(nativeEvent) && e?.active?.id !== e?.over?.id) {
      dispatch({
        type: "dnd",
        payload: { startIndex: e.active.id, endIndex: e.over.id },
      });
    } else if (nativeEvent && isNaN(nativeEvent) && nativeEvent != null) {
      if (nativeEvent == "isDone") {
        dispatch({ type: "isDone", payload: { startIndex: e.active.id } });
      }
      if (nativeEvent == "details") {
        props.handleGlobalRender(e.activatorEvent);
        props.handleClick(e);
      }
    }
  };

  const [listRef, enableAnimate] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="mt-24">
      {tableData?.data && !sumRout ? (
        td && (
          <DndContext
            sensors={sensor}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={td.map((row: any) => row.id)}
              strategy={verticalListSortingStrategy}
            >
              {allFinished && (
                <button
                  onClick={() => {
                    console.log({ sumRout });
                    setSumRout(!sumRout);
                  }}
                  className="btn1"
                >
                  {" "}
                  סכם מסלול{" "}
                </button>
              )}
              <div
                ref={listRef}
                className="flex flex-col w-full items-center justify-center gap-2"
              >
                {td.map((row: any, idx: number) => {
                  return (
                    <DataRow
                      movment={props.movment}
                      id={row.id}
                      key={idx}
                      index={idx}
                      row={row}
                      handleDragEnd={handleDragEnd}
                      headers={Object.keys(td[0])}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )
      ) : (
        <h1>loading.....</h1>
      )}
      {/* <Model
      header={'פירוט לנהג'}
      
      /> */}
      {sumRout && (
        <Summery
          render={props.render}
          setReder={props.setReder}
          handleClick={props.handleClick}
          setSumRout={setSumRout}
        />
      )}
    </div>
  );
}

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { DndContext, closestCenter, useSensor, PointerSensor } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DataRow from "./DataRow";
import { missionsReducer } from "../helper";

export default function Missions(props: any) {
  console.log("missions props ", { props });
  const [tableData, dispatch] = useReducer(missionsReducer, {
    data: props.missions,
    startIndex: 0,
    endIndex: 0,
  });

  const sensor = [useSensor(PointerSensor)];
  const [td, setTd] = useState<any[]>();

  useEffect(() => {
    setTd([...tableData.data]);
  }, [tableData.data]);

  const handleDragEnd = (e: any) => {
    const nativeEvent = e.activatorEvent?.target?.id ? e.activatorEvent.target.id : null;

    if (!isNaN(nativeEvent) && e?.active?.id !== e?.over?.id) {
      dispatch({ type: "dnd", payload: { startIndex: e.active.id, endIndex: e.over.id } });
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

  const [listRef] = useAutoAnimate<HTMLDivElement>();
  return (
    <div>
      {tableData.data ? (
        td && (
          <DndContext sensors={sensor} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={td.map((row: any) => row.id)} strategy={verticalListSortingStrategy}>
              <div ref={listRef} className="flex flex-col w-full items-center justify-center gap-2">
                {td.map((row: any, idx: number) => {
                  return (
                    <DataRow
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
    </div>
  );
}

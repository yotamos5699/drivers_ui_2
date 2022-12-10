import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { DndContext, closestCenter, useSensor, PointerSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DataRow from "./DataRow";

export default function Missions(props: any) {
  // const sortTableData = (missions: any[], Midx: number) => {
  //   let a = [];
  //   missions.forEach((m: any, i: number) => {
  //     if (i != Midx) a.push(m);
  //   });
  //   a.push(missions[Midx]);
  //   console.log({ a });
  //   return a;
  // };
  const dddd = ["sss", "fff", "Asd", "isuid"];
  console.log({ props });

  // const setMissions = (missions: any) => {
  //   let sorted: any[] = [];
  //   let m = missions;
  //   m.map((m: any) => (m.isDone == true ? sorted.push(m) : sorted.unshift(m)));

  //   return sorted;
  // };
  //const queryClient = useQueryClient();
  const sensor = [useSensor(PointerSensor)];
  const [tableData, setTableData] = useState(() =>
    props.missions.map((row: any, i: number) => {
      return { id: i, ...row };
    })
  );

  // setTableData([...newTdata]);

  // async function updateRowStatus(data: any) {
  //   console.log("update table data props ", { data });
  //   if (data.cellID == "isDone") {
  //     console.log("is is done !!");
  //     let newTableData = [];
  //     for (let i = 0; i <= data.tableData.length - 1; i++) {
  //       let parsedIndex = parseInt(data.index);
  //       if (i === parsedIndex) {
  //         console.log({ i, parsedIndex });
  //         newTableData.push({ ...data.tableData[i], isDone: !data.tableData[i].isDone });
  //       } else {
  //         newTableData.push(data.tableData[i]);
  //         console.log;
  //       }
  //     }

  //     console.log({ newTableData });
  //     setTableData([...newTableData]);
  //   }
  // }
  // const handleChange = (e: any) => {
  //   console.log("the e ", { e });
  // };

  // const handleClick = (e: any, props: any) => {
  //   const cid = e.target.id;
  //   console.log(props.index, " ", { tableData, cid });
  //   cid == "isDone" && updateRowStatus({ tableData: tableData, index: props.index, cellID: cid });
  // };

  const handleDragEnd = (e: any) => {
    if (e.active.id !== e.over.id) {
      console.log("sheet is on");

      const oldIndex = tableData.findIndex((row: any) => row.id === e.active.id);
      const newIndex = tableData.findIndex((row: any) => row.id === e.over.id);

      setTableData([...arrayMove(tableData, parseInt(oldIndex), parseInt(newIndex))]);
    }
    console.log({ tableData });
  };

  //  const [listRef] = useAutoAnimate<HTMLDivElement>();
  return (
    // <div ref={listRef}>
    <div>
      {tableData ? (
        <table>
          <thead className="bg-white border-b">
            <tr className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
              {Object.keys(tableData[0]).map(
                (header, idx) =>
                  header != "isDone" && (
                    <td className="td" key={idx + 1111}>
                      {header}
                    </td>
                  )
              )}
              <td className="td">פירוט</td>
              <td className="td">נווט</td>

              <td className="td">בוצע</td>
            </tr>
          </thead>

          <tbody>
            <DndContext sensors={sensor} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={tableData.map((row: any) => row.id)} strategy={verticalListSortingStrategy}>
                {tableData.map((row: any, idx: number) => {
                  return (
                    <DataRow
                      id={row.id}
                      key={idx}
                      index={idx}
                      row={row}
                      //  onChange={handleChange}
                      // handleClick={handleClick}
                      headers={Object.keys(tableData[0])}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </tbody>
        </table>
      ) : (
        <h1>loading.....</h1>
      )}
    </div>
  );
}

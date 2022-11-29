import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";

export default function Table(props: any) {
  const sortTableData = (missions: any[], Midx: number) => {
    let a = [];
    missions.forEach((m: any, i: number) => {
      if (i != Midx) a.push(m);
    });
    a.push(missions[Midx]);
    console.log({ a });
    return a;
  };
  const [missionss, setMissionss] = useState<any>();
  useEffect(() => {
    console.log({ props });
    let m = props?.missions;
    let sorted = [];
    m.map((m: any) => (m.isDone == true ? sorted.push(m) : sorted.unshift(m)));
    setMissionss([...m]);
  }, [props.missions]);
  const [listRef] = useAutoAnimate<HTMLDivElement>();
  return (
    <div ref={listRef}>
      {missionss ? (
        <table>
          <thead className="bg-white border-b">
            <tr className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
              {Object.keys(missionss[0]).map(
                (header, idx) =>
                  header != "isDone" && (
                    <td className="td" key={idx + 1111}>
                      {header}
                    </td>
                  )
              )}
              <td className="td">פירוט</td>
              <td className="td">נווט</td>
              <td className="td">תשלום</td>
              <td className="td">בוצע</td>
            </tr>
          </thead>
          <tbody>
            {missionss.map((row: any, idx: number) => (
              <DataRow
                key={idx}
                row={row}
                handleClick={props.handleClick}
                headers={Object.keys(missionss[0])}
              />
            ))}
            <tr></tr>
          </tbody>
        </table>
      ) : (
        <h1>loading.....</h1>
      )}
    </div>
  );
}

export function DataRow(props: any) {
  let rData = props.row;
  // console.log({ rData });
  return (
    <tr
      className={props.row["isDone"] == true ? " tr bg-gray-200" : "tr"}
      onClick={(e) => props.handleClick(e, props)}
    >
      {Object.values(props.row).map((cell: any, idx) => {
        // console.log(cell, "header ", props.headers[idx]);
        return (
          props.headers[idx] != "isDone" && (
            <td className="td" key={idx}>
              {cell ? cell : "noData"}
            </td>
          )
        );
      })}
      <td id="details" className="td">
        D
      </td>
      <td id="nav" className="td">
        NAV
      </td>
      <td id="pay" className="td">
        $$
      </td>
      {/* // <td id="isDone" className="td"> */}
      <td>
        <input
          id="isDone"
          type={"checkbox"}
          onChange={(e) => props.handleClick(e, props)}
          checked={props.row["isDone"]}
        />
      </td>
      {/* </td> */}
    </tr>
  );
}

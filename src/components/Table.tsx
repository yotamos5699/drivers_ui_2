import React from "react";

export default function Table(props: any) {
  return (
    <div>
      {props.missions ? (
        <table>
          <thead className="bg-white border-b">
            <tr className="text-sm font-medium text-gray-900 px-6 py-4 text-center">
              {Object.keys(props.missions[0]).map((header, idx) => (
                <td className="td" key={idx + 1111}>
                  {header}
                </td>
              ))}
              <td className="td">פירוט</td>
              <td className="td">נווט</td>
              <td className="td">תשלום</td>
              <td className="td">בוצע</td>
            </tr>
          </thead>
          <tbody>
            {props.missions.map((row: any, idx: number) => (
              <DataRow key={idx} row={row} handleClick={props.handleClick} />
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
  return (
    <tr className="tr" onClick={(e) => props.handleClick(e, props)}>
      {Object.values(props.row).map((cell: any, idx) => (
        <td className="td" key={idx}>
          {cell ? cell : "noData"}
        </td>
      ))}
      <td id="details" className="td">
        D
      </td>
      <td id="nav" className="td">
        NAV
      </td>
      <td id="pay" className="td">
        $$
      </td>
      <td id="isDone" className="td">
        <input type={"checkbox"} className=""></input>
      </td>
    </tr>
  );
}

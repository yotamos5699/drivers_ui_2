import { useState } from "react";
import { backToLogin, Logger, renderScreen } from "../helper";
import Model from "./Model";

type headerProps = {
  render: any;
  user: any;
  setRender: any;
  storageHeaders: any;
  movment: any;
  setMovment: any;
};

function Header(props: headerProps) {
  Logger(props, " headers props");
  //const [visible, setVisible] = useState(false);

  // const handleClick = () => {
  //   setVisible(!visible);
  // };
  return (
    <div className=" flex flex-col fixed top-0 z-30 w-full px-2 py-4 h bg-white sm:px-4 shadow-xl">
      <div className="flex justify-between h">
        <h2>שלום {props?.user?.name}</h2>
        <div>
          {props.render?.data.table
            ? "המשימות של היום "
            : props.render?.data.details
            ? "פירוט"
            : props.render?.data.pay
            ? "תשלום"
            : "כלום"}
        </div>
        {props?.render?.data?.table && (
          <div className="flex gap-2 border-blue-500 border-2">
            {/* <p> אפשר תנועה</p> */}
            <button
              className={!props.movment.data ? "btn1 h-full w-60 bg-green-600" : "btn1 h-full w-60 bg-red-400"}
              //   value={props.movment.data}
              // checked={props.movment.data}
              onClick={() => {
                props.setMovment({ data: !props.movment.data });
              }}
              // type="checkbox"
            >
              {!props.movment.data ? "אפשר תנועה" : "חסום תנועה"}
            </button>
          </div>
        )}
        {props?.render?.data.storage && props?.storageHeaders?.data?.amount != 0 && (
          <div className="flex gap-2">
            <p> מס לקוחות </p>
            <p>{props.storageHeaders.data.amount}</p>
          </div>
        )}

        {!props.render.data.storage && (
          <>
            <button className={"border-pink-400 border-2 px-2 "}> מידע </button>
            <button
              id="table"
              onClick={() => props.setRender({ ...renderScreen("storage", props.render.data) })}
              className={"border-pink-400 border-2 px-2 "}
            >
              {" "}
              למחסן{" "}
            </button>
          </>
        )}
        <button
          className={"border-pink-400 border-2 px-2 "}
          onClick={() => {
            backToLogin(props.setRender, props.render.data != null);
          }}
        >
          התנתק
        </button>
      </div>
      <div>
        {props?.render?.data?.storage && props?.storageHeaders?.data?.headers && (
          <tr key={"asd"} className="tr top-0 h-1/6 border-green-500 border-4">
            {props.storageHeaders.data.headers.map(
              (header: any, idx: number) =>
                header != "isDone" && (
                  <td className="td" key={idx + 1111}>
                    {header}
                  </td>
                )
            )}
            <p className="td3">משקל</p>
            <p className="td">מוכן</p>
          </tr>
        )}
      </div>
    </div>
  );
}

export default Header;

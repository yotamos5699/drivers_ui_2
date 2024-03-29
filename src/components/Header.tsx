import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchMessageData } from "../api";
import { backToLogin, Logger, renderScreen } from "../helper";
import Model from "./Model";
import useLocalStorage from "../Hooks/useLocalStorage";

type headerProps = {
  render: any;
  user: any;
  setRender: any;
  storageHeaders: any;
  movment: any;
  setMovment: any;
  currentMission: any;
  fullMatrix: any;
};

function Header(props: headerProps) {
  const [cmission, setMission] = useLocalStorage("current_mission", { data: null });
  useEffect(() => {
    if (props?.currentMission) setMission({ data: { ...props.currentMission } });
  }, [props?.currentMission]);

  //const [visible, setVisible] = useState(false);
  const generalMessage = useQuery({
    queryKey: ["msg2"],
    queryFn: () => fetchMessageData({ מפתח: "12345678" }),
  });
  // const handleClick = () => {
  //   setVisible(!visible);
  // };
  return (
    <div className=" flex flex-col max-h-10 fixed top-0 z-30 w-full px-2 py-4 h bg-white sm:px-4 shadow-xl">
      <div className="flex justify-between h">
        <h2>שלום {props?.user?.name}</h2>
        <div className="font-bold">
          {props.render?.data.table
            ? "המשימות של היום "
            : props.render?.data.details
            ? `פירוט ללקוח- ${props.currentMission["שם חשבון"]}`
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
            <p className="flex gap-2">
              <span>שם מטריצה</span>
              <span>{props.fullMatrix?.matrixName}</span>
            </p>
            <p> מס לקוחות </p>
            <p>{props.storageHeaders.data.amount}</p>
          </div>
        )}

        {!props.render.data.storage && (
          <>
            <button className={"border-pink-400 border-2 px-2 "}> מידע </button>
            <button
              id="table"
              onClick={() =>
                props.setRender({
                  ...renderScreen("storage", props.render.data),
                })
              }
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
          <div className="flex flex-col">
            <tr key={"asd"} className="flex tr  top-0 max-h-24 overflow-clip border-green-500 border-2 ">
              {props.storageHeaders.data.headers.map(
                (header: any, idx: number) =>
                  header != "isDone" && (
                    <td className="td" key={idx + 1111}>
                      {header}
                    </td>
                  )
              )}
              <p className="td3 mb-0">משקל</p>
              <p className="td mb-0">מוכן</p>
            </tr>
            <div className="h-10 flex w-full items-center border-green-500 border-2">
              <p className="w-1/5">הודעה כללית</p>
              <div className={" w-full text-center"}>{generalMessage.isLoading ? "טוען" : generalMessage.data.data.content}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;

import { useLayoutEffect, useState } from "react";
import useLocalStorage from "../Hooks/useLocalStorage";

function Pay(props: any) {
  const [cmission, setMission] = useLocalStorage("current_mission", { data: null });
  const [totalPayed, setTotalPayed] = useLocalStorage("total_payed", { data: null });
  const [showPay, setShowPay] = useState(false);
  const [payed, setPayed] = useState(false);
  const [sum, setSum] = useState(0);
  const [payType, setPayType] = useState();
  console.log({ cmission, totalPayed });
  useLayoutEffect(() => {
    const castumerName = cmission.data["שם חשבון"];
    const isPayed = totalPayed.data.find((row: any) => row[1] == castumerName);
    if (isPayed) setPayed((prev) => !prev);
  }, []);
  console.log({ payed });
  const handleClick = (Event: any) => {
    setPayType(Event.target.name);
    setShowPay(!showPay);
  };
  return (
    <div className="flex flex-col h-full w-full">
      {!showPay && (
        <div>
          <div className={"flex flex-col "}>
            <button className="btn1 h-1/3" onClick={(Event) => handleClick(Event)} id={"main"} name="check">
              תשלום בשיק
            </button>
            <button
              disabled={payed}
              className={`btn1 h-1/3 ${payed ? "bg-gray-400" : ""}`}
              onClick={(Event) => handleClick(Event)}
              id={"main"}
              name="cash"
            >
              {payed ? "תשלום במזומן לא זמין(הלקוח שילם)" : "תשלום במזומן"}
            </button>
            <button className="btn1 h-1/3" onClick={props.handleClick} id={"main"} name="back">
              חזור
            </button>
          </div>
        </div>
      )}
      {showPay && (
        <div className="flex flex-col min-h-full w-full">
          <h1 className="flex w-full h-30 text-6xl">הקלד סכום</h1>
          <input
            type={"number"}
            value={sum}
            onChange={(Event) => {
              setSum(parseInt(Event.target.value));
            }}
            className="border-blue-400 border-4"
          />

          <button
            id="main"
            name={payType}
            onClick={(Event) => {
              props.handleClick(Event, sum);
            }}
            className="btn1"
          >
            סיום
          </button>
        </div>
      )}
    </div>
  );
}

export default Pay;

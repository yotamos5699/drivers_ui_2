import { useState } from "react";

function Pay(props: any) {
  const [showPay, setShowPay] = useState(false);
  const [sum, setSum] = useState(0);
  const [payType, setPayType] = useState();

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
            <button className="btn1 h-1/3" onClick={(Event) => handleClick(Event)} id={"main"} name="cash">
              תשלום במזומן
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

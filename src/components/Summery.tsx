import React from "react";
import coin1 from "../assets/COINS/1.jpg";
import coin2 from "../assets/COINS/2.jpg";
import coin5 from "../assets/COINS/5.jpg";
import coin10 from "../assets/COINS/10.jpg";
import bill20 from "../assets/BILLS/20.jpg";
import bill50 from "../assets/BILLS/51.jpg";
import bill100 from "../assets/BILLS/100.jpg";
import bill200 from "../assets/BILLS/201.jpg";
import { backToLogin, renderScreen, updateResponseDB } from "../helper";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useEffect, useState } from "react";

const Bills = [
  { img: bill20, amount: 0, billValue: 20, name: "עשרים" },
  { img: bill50, amount: 0, billValue: 50, name: "חמישים" },
  { img: bill100, amount: 0, billValue: 100, name: "מאה" },
  { img: bill200, amount: 0, billValue: 200, name: "מאתיים" },
];

const Coins = [
  { img: coin1, amount: 0, billValue: 1, name: "שקל" },
  { img: coin2, amount: 0, billValue: 2, name: "שנקל" },
  { img: coin5, amount: 0, billValue: 5, name: "חמש" },
  { img: coin10, amount: 0, billValue: 10, name: "עשר" },
];
function Summery(props: any) {
  const [bills, setBills] = useState([...Bills]);
  const [coins, setCoins] = useState([...Coins]);
  const [by, setBy] = useState(false);
  const [render, setRender] = useState({
    co: false,
    bi: true,
  });
  const [totalSum, setTotalSum] = useState(0);
  useEffect(() => {
    let sum = 0;
    bills.forEach((bill) => (sum += bill.amount * bill.billValue));
    coins.forEach((coin) => (sum += coin.amount * coin.billValue));
    setTotalSum(sum);
  }, [bills, coins]);
  // const handleClick = (idx: any) => {
  //   console.log({ idx });
  // };

  const handleClick = (e: any, data: any) => {
    if (e.target.id == "main" && e.target?.name == "summery") {
      updateResponseDB(data, "payments", "סיכום", props.mission);
      console.log('updateResponseDB(data,payment,"מזומן",props.mission)', { data, e });
    }
  };
  console.log({ bills });
  return (
    <div>
      {!by && (
        <div className="flex-col w-full h-full border-blue-400 border-4">
          <div className="flex">
            <button id="main" name="back" className="btn1 w-1/4" onClick={() => props.setSumRout(false)}>
              חזור
            </button>
            <div className="flex w-1/2">
              <button className="btn1 w-1/2" onClick={() => setRender({ co: !render.co, bi: !render.bi })}>
                {render?.bi ? "מטבעות" : "שטרות"}
              </button>
              <div className="flex flex-col w-full items-center">
                <h2>סה"כ</h2>
                <div className={"text-3xl"}> {totalSum}</div>
              </div>
            </div>

            <button
              id="main"
              name="summery"
              onClick={(event: any) => {
                setBy(true);
                handleClick(event, [...coins, ...bills]);
              }}
              className="btn1 bg-yellow-200 text-black w-1/4"
            >
              סיים מסלול
            </button>
          </div>
          <div className="grid grid-cols-2 h-full w-full">
            {render?.bi &&
              bills.map((bill, idx) => (
                <div className="flex border-red-500 border-4 w-full h-full">
                  <div className="flex flex-col  text-center w-1/2 border-4">
                    <button
                      onClick={() =>
                        setBills((prev) =>
                          prev.map((bill: any, i: number) => {
                            if (i === idx) return { ...bill, amount: bill.amount + 1 };
                            else return bill;
                          })
                        )
                      }
                      className="bg-green-400 hover:bg-green-600 h-1/2"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setBills((prev) =>
                          prev.map((bill: any, i: number) => {
                            console.log({ prev, bill });
                            if (i === idx) return { ...bill, amount: bill.amount - 1 };
                            else return bill;
                          })
                        )
                      }
                      className="bg-red-300 hover:bg-red-600 h-1/2"
                    >
                      -
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute top-1/2 left-1/2 text-white text-9xl ">{bill.amount}</div>
                    <LazyLoadImage
                      src={bill.img}
                      className="h-full w-full bg-gradient-to-tr from-black to-gra"
                      alt="Image Alt"
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="grid grid-cols-2 w-full">
            {render?.co &&
              coins.map((coin, idx) => (
                <div key={idx} className="flex w-full h-full border-gray-500 border-4">
                  <div className="flex flex-col text-center w-1/2 h-full">
                    <button
                      onClick={() =>
                        setCoins((prev) =>
                          prev.map((coin: any, i: number) => {
                            if (i === idx) return { ...coin, amount: coin.amount + 1 };
                            else return coin;
                          })
                        )
                      }
                      className="bg-green-400 hover:bg-green-600 h-1/2"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        setCoins((prev) =>
                          prev.map((coin: any, i: number) => {
                            console.log({ prev, coin });
                            if (i === idx) return { ...coin, amount: coin.amount - 1 };
                            else return coin;
                          })
                        )
                      }
                      className="bg-red-300 hover:bg-red-600 h-1/2"
                    >
                      -
                    </button>
                  </div>

                  <div className="w-1/2 ">
                    {" "}
                    <div className="absolute self-center text-white text-9xl ">{coin.amount}</div>
                    <LazyLoadImage src={coin.img} className="h-full from-black to-gra" alt="Image Alt" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {by && (
        <div>
          <p className="flex text-9xl text-center">ביי !!!!!!!!!!!!</p>
          <button
            id={"restart"}
            onClick={() => {
              backToLogin(props.setReder, props.render);
            }}
            className="btn1"
          >
            {" "}
            חזור למסך כניסה{" "}
          </button>
        </div>
      )}
    </div>
  );
}

export default Summery;

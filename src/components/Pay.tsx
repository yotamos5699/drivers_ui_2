import coin1 from "../assets/COINS/1.jpg";
import coin2 from "../assets/COINS/2.jpg";
import coin5 from "../assets/COINS/5.jpg";
import coin10 from "../assets/COINS/10.jpg";
import bill20 from "../assets/BILLS/20.jpg";
import bill50 from "../assets/BILLS/51.jpg";
import bill100 from "../assets/BILLS/100.jpg";
import bill200 from "../assets/BILLS/201.jpg";
import { renderScreen } from "../helper";
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
function Pay(props: any) {
  const [bills, setBills] = useState([...Bills]);
  const [coins, setCoins] = useState([...Coins]);
  const [totalSum, setTotalSum] = useState(0);
  const [render, setRender] = useState({
    co: false,
    bi: true,
  });
  const [showPay, setShowPay] = useState(false);
  useEffect(() => {
    let sum = 0;
    bills.forEach((bill) => (sum += bill.amount * bill.billValue));
    coins.forEach((coin) => (sum += coin.amount * coin.billValue));
    setTotalSum(sum);
  }, [bills, coins]);
  // const handleClick = (idx: any) => {
  //   console.log({ idx });
  // };
  console.log({ bills });

  const handleClick = () => {
    setShowPay(!showPay);
  };
  return (
    <div className="flex flex-col">
      {!showPay && (
        <div>
          <div className={"flex flex-col w-screen h-screen"}>
            <button className="btn1 h-1/3" onClick={props.handleClick} id={"main"} name="check">
              תשלום בשיק
            </button>
            <button className="btn1 h-1/3" onClick={handleClick} id={"cash"} name="cash">
              תשלום במזומן
            </button>
            <button className="btn1 h-1/3" onClick={props.handleClick} id={"main"} name="back">
              חזור
            </button>
          </div>
        </div>
      )}
      {showPay && (
        <div>
          <div className="hdr1 ">
            <button id="main" name="back" className="btn1 w-1/4" onClick={props.handleClick}>
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
              name="cash"
              onClick={(event: any) => props.handleClick(event, [...coins, ...bills])}
              className="btn1 w-1/4"
            >
              הפק
            </button>
          </div>
          {render?.bi &&
            bills.map((bill, idx) => (
              <div key={idx} className="flex">
                <div className="flex flex-col text-[60px] text-center w-1/4">
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
                    className="h-full w-screen bg-gradient-to-tr from-black to-gra"
                    alt="Image Alt"
                  />
                </div>
              </div>
            ))}
          {render?.co &&
            coins.map((coin, idx) => (
              <div key={idx} className="flex h-56">
                <div className="flex flex-col text-[60px] text-center w-1/4">
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

                <div className="relative">
                  <div className="absolute top-1/2 left-1/2 text-white text-9xl ">{coin.amount}</div>
                  <LazyLoadImage
                    src={coin.img}
                    className="h-full w-screen bg-gradient-to-tr from-black to-gra"
                    alt="Image Alt"
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Pay;

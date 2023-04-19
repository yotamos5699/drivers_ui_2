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
import { useQuery } from "@tanstack/react-query";
import { getDriverPayments } from "../api";
import useLocalStorage from "../Hooks/useLocalStorage";

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
  const [driver, setDriver] = useLocalStorage("driver", {
    data: null,
    subKey: null,
  });

  console.log({ driver });
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
  const paymentsSummery = useQuery({
    queryKey: ["paymentsSum"],
    queryFn: getDriverPayments,
  });
  useEffect(() => {
    const p = paymentsSummery?.data;
    console.log({ p });
  }, [paymentsSummery.data]);

  const handleClick = (e: any, data: any) => {
    if (e.target.id == "main" && e.target?.name == "summery") {
      updateResponseDB(data, "payments", "סיכום", props.mission);
      console.log('updateResponseDB(data,payment,"מזומן",props.mission)', {
        data,
        e,
      });
    }
  };
  console.log({ bills });
  const dailySum = (type: string) => {
    let sumCash = 0;
    let sumShake = 0;
    for (let i = 1; i <= paymentsSummery.data.length - 1; i++) {
      if (driver.data.name === paymentsSummery.data[i][0]) {
        if (paymentsSummery.data[i][2] == "מזומן") sumCash += paymentsSummery.data[i][4];
        if (paymentsSummery.data[i][2] == "שיק") sumShake += paymentsSummery.data[i][4];
      }
    }
    return type == "מזומן" ? sumCash : sumShake;
  };
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
                handleClick(event, [...(coins ?? []), ...(bills ?? [])]);
              }}
              className="btn1 bg-yellow-200 text-black w-1/4"
            >
              צפה בתנועות
            </button>
            <button
              name="summery"
              id={"restart"}
              onClick={() => {
                backToLogin(props.setReder, props.render);
              }}
              className="btn1 bg-red-600 text-white w-1/4"
            >
              סיים מסלול
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {render?.bi &&
              bills.map((bill, idx) => (
                <div key={`${bill}${idx}`} className="flex border-red-500 border-4 max-w-[340px] h-full">
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
                    <LazyLoadImage src={bill.img} className="h-full w-full bg-gradient-to-tr from-black to-gra" alt="Image Alt" />

                    <input
                      value={bill.amount}
                      className="absolute text-center text-white left-2 top-2 border-2 bg-green-700 rounded-full border-green-600 w-1/6 h-1/4"
                      type={"number"}
                      onChange={(e) =>
                        setBills((prev) =>
                          prev.map((bill: any, i: number) => {
                            console.log({ prev, bill });
                            if (i === idx) return { ...bill, amount: parseInt(e.target.value) };
                            else return bill;
                          })
                        )
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {render?.co &&
              coins.map((coin, idx) => (
                <div key={idx} className="flex border-red-500 border-4 max-w-[340px] h-full">
                  <div className="flex flex-col  text-center w-1/2 border-4">
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
                    {" "}
                    <LazyLoadImage src={coin.img} className="h-full from-black to-gra" alt="Image Alt" />
                    <input
                      value={coin.amount}
                      className="absolute text-center text-white left-2 top-2 border-2 bg-green-700 rounded-full border-green-600 w-1/6 h-1/4"
                      type={"number"}
                      onChange={(e) =>
                        setCoins((prev) =>
                          prev.map((Coin: any, i: number) => {
                            console.log({ prev, Coin });
                            if (i === idx) return { ...Coin, amount: parseInt(e.target.value) };
                            else return Coin;
                          })
                        )
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {by && paymentsSummery && (
        <div>
          <div>
            <div className="flex gap-10">
              <p className="flex text-xl text-center ">סיכום</p>
              <div className="flex">
                <p className=" ml-4"> סה"כ מזומן</p>
                {paymentsSummery?.data && <p>{dailySum("מזומן")}</p>}
              </div>
              <div className="flex">
                <p className=" ml-4"> סה"כ בשקים</p>
                {paymentsSummery?.data && <p>{dailySum("שיק")}</p>}
              </div>
            </div>
            <div className="flex flex-col h-full">
              {paymentsSummery?.data?.map((row: any[]) => {
                console.log({ row });
                if (row[0] == driver.data.name)
                  return (
                    <div className="flex  w-full  border-2 border-pink-400">
                      {row.map((cell: any) => (
                        <p className=" w-1/6 ">{cell}</p>
                      ))}
                    </div>
                  );
              })}
            </div>
          </div>
          <div className="flex">
            <button
              id={"restart"}
              onClick={() => {
                backToLogin(props.setReder, props.render);
              }}
              className="btn1 bg-red-600 text-white w-1/2"
            >
              {" "}
              סיים מסלול{" "}
            </button>
            <button
              id={"restart"}
              onClick={() => {
                setBy((prev) => !prev);
              }}
              className="btn1 w-1/2"
            >
              {" "}
              חזור לסיכום{" "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summery;

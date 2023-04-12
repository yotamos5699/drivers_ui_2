import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { fetchCarsData } from "../api";
import { updateResponseDB } from "../helper";
import { driver } from "../typing";
interface carPairingProps {
  jobs: any;
  driver: driver;
  setIsPaired: any;
}
interface carPairing {
  driverNum: string | null;
  driverName: string | null;
  car: string | null;
  type?: "zone" | "driver";
}

function CarPairing(props: carPairingProps) {
  const carsData = useQuery({ queryKey: ["carsdata"], queryFn: fetchCarsData });
  const [carPairingState, setCarPairingState] = useState<carPairing>({
    driverNum: null,
    driverName: null,
    car: null,
  });
  console.log("pairing props...", { props });
  const cars = ["אופל", "סיטרואן", "קאיה"];
  const [ifError, setIfError] = useState(false);
  const handlePairing = (data: carPairing) => {
    if (!Object.values(data).filter((val: string | null) => val == null)[0]) {
      updateResponseDB(data, "carpairing");
      props.setIsPaired({ data: true });
    } else setIfError(true);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {carsData.data ? (
        <>
          <h1>שלום {props.driver.name}... התאם את הרכב</h1>
          <select
            className="flex shadow appearance-none text-center border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="select"
            //className={"flex bg-orange-100 align-middle text-5xl text-black"}
            id="pivot"
            onChange={(Event) => {
              setCarPairingState({
                ...carPairingState,
                car: Event.target.value,
              });
            }}
          >
            <option value={undefined} selected hidden>
              בחר רכב
            </option>
            {carsData.data.map((car: any, idx: number) => (
              <option className="text-black text-xl w-1/3" key={idx}>
                {car.name}
              </option>
            ))}
          </select>
          {!props.jobs ? (
            <div className="flex flex-col w-full h-14 items-center">
              <p>המשתמש הוא מסוג אזור, הקלד\י את שמך</p>
              <textarea
                onChange={(Event) => {
                  setCarPairingState({
                    ...carPairingState,
                    driverName: Event.target.value,
                  });
                }}
                className="flex flex-col w-20 border-blue-400 border-2"
              ></textarea>
            </div>
          ) : (
            <select
              className="flex shadow appearance-none text-center border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="select"
              //className={"flex bg-orange-100 align-middle text-5xl text-black"}
              id="pivot"
              onChange={(Event) => {
                setCarPairingState({
                  ...carPairingState,
                  driverName: Event.target.value,
                });
              }}
            >
              <option value={undefined} selected hidden>
                בחר נהג
              </option>
              {props.jobs.drivers.map((driver: any, idx: number) => (
                <option className="text-black text-xl w-1/3" key={idx}>
                  {driver}
                </option>
              ))}
            </select>
          )}
          <button
            className={ifError ? "btn1 bg-red-600" : "btn1"}
            onClick={() => {
              handlePairing({
                ...carPairingState,
                driverNum: props.driver.pivotKey,
                driverName: props.driver.name,
              });
            }}
          >
            בחר
          </button>
        </>
      ) : (
        <h1 className="h-screen w-screen flex text-center justify-center align-middle ">טוען רכבים....</h1>
      )}
    </div>
  );
}

export default CarPairing;

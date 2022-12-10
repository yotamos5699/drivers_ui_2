import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCastumersData, fetchDriversData, fetchLastMatrix } from "../api";
import Nav from "./Nav";
import { driver } from "../typing";

export default function Login() {
  const [driver, setDriver] = useState<driver | undefined>();
  const [input, setInput] = useState("");
  const drivers = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDriversData,
  });
  const castumers = useQuery({
    queryKey: ["castumers"],
    queryFn: fetchCastumersData,
  });
  const matrix = useQuery({ queryKey: ["matrix"], queryFn: fetchLastMatrix });

  const responseToSubmitRequest = (value: string, driversData: driver[]) => {
    const currentDriver = driversData.filter((row) => {
      if (row.password.toString() == value) {
        console.log("data ok ", row);
        return row;
      }
    });
    if (currentDriver?.length == 1) setDriver(currentDriver[0]);
    console.log({ currentDriver });
  };

  const handleClick = (e: any) => {
    let name = e.target.name;
    let value = input;
    console.log({ name, value, input });
    if (name == "password_btn") {
      drivers?.data && responseToSubmitRequest(value, drivers.data);
    }
  };

  return (
    <>
      {!driver ? (
        <div className="flex flex-col items-center justify-center h-screen  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <input
            value={input}
            onInput={(e: any) => setInput(e.target.value)}
            name="password"
            className="shadow appearance-none text-center border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="הכנס סיסמה"
          />
          <button
            name="password_btn"
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold border rounded w-full py-2 px-3 border-blue-700 hover:border-blue-500 rounded"
            placeholder="Username"
          >
            כנס
          </button>
        </div>
      ) : matrix.isLoading || castumers.isLoading ? (
        <h1>laoding ....</h1>
      ) : matrix.error || castumers.error ? (
        <h1>error ....</h1>
      ) : (
        matrix.data && castumers.data && <Nav user={driver} matrix={matrix.data} castumers={castumers.data} />
      )}
    </>
  );
}

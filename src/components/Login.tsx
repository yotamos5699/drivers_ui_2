import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchCastumersData, fetchDriversData, fetchLastMatrix } from "../api";
import Nav from "./Nav";
import { driver } from "../typing";
import { useInitializedState } from "../helper";

export default function Login() {
  const [driver, setDriver] = useState<driver>();
  const [input, setInput] = useState("");
  const [toShow, setToShow] = useState<any>();

  fetchToShowAndLogin(setDriver, setToShow);
  const { drivers, castumers, matrix } = setQueryData();

  const responseToSubmitRequest = (value: string, driversData: driver[]) => {
    window.localStorage.setItem("login", "false");
    setToShow(false);
    const currentDriver = driversData.filter((row) => {
      if (row.password.toString() == value) {
        console.log("data ok ", row);
        return row;
      }
    });
    if (currentDriver?.length == 1) {
      setDriver(currentDriver[0]);
      console.log("setting driver !!!!");
      window.localStorage.setItem("driver", JSON.stringify(currentDriver[0]));
    }
    console.log({ currentDriver });
  };

  const handleClick = (e: any) => {
    let name = e.target.name;
    let value = input;
    console.log({ name, value, input });
    name == "password_btn" && drivers?.data && responseToSubmitRequest(value, drivers.data);
  };

  return (
    <>
      {toShow ? (
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
      ) : (
        matrix.error || (castumers.error && <h1>error ....</h1>)
      )}

      {!toShow && driver && (
        <Nav
          user={driver}
          matrix={matrix.data}
          castumers={castumers.data}
          driver={driver.pivotKey}
          loginShow={setToShow}
        />
      )}
    </>
  );
}

const fetchToShowAndLogin = async (setDriver: any, setToShow: any) => {
  useEffect(() => {
    async function fetchStorage() {
      let res1 = await useInitializedState("driver");
      console.log({ res1 });
      setDriver(res1);
      let res2 = await useInitializedState("login");
      console.log({ res2 });
      setToShow(res2);
    }
    fetchStorage();
  }, []);
};

const setQueryData = () => {
  console.log("in set query !!!!!");
  const drivers = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchDriversData,
  });
  const castumers = useQuery({
    queryKey: ["castumers"],
    queryFn: fetchCastumersData,
  });
  const matrix = useQuery({ queryKey: ["matrix"], queryFn: fetchLastMatrix });
  return { drivers, castumers, matrix };
};

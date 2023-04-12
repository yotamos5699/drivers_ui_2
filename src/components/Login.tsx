import { QueryCache, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchCastumersData, fetchCurrentDayMarixes, fetchDriversData, fetchLastMatrix, setMatrixUrl } from "../api";
import Nav from "./Nav";
import { driver } from "../typing";
import { backToLogin, defaultRender, Logger, renderScreen, useInitializedState } from "../helper";
import useLocalStorage from "../Hooks/useLocalStorage";
import AdminScreen from "./AdminScreen";
import axios from "axios";
const U =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec?type=getcurrentid";
export default function Login() {
  const [render, setRender] = useLocalStorage("render", {
    data: defaultRender,
  });
  const [currentMatrix, setCurrentMatrix] = useState<any>();
  const [driver, setDriver] = useLocalStorage("driver", {
    data: null,
    subKey: null,
  });
  const [input, setInput] = useState("");
  const { drivers, castumers, matrixes, jobs } = setQueryData();

  Logger(matrixes.data, "matrixes sssss");
  useEffect(() => {
    console.log(matrixes.data);
    if (matrixes?.data?.length) {
      console.log("i  use effect login matrixes.length ");
      const setMatrixID = async () =>
        await axios.get(U).then((res) => {
          return res.data.password;
        });

      setMatrixID().then((id: boolean | string) => {
        console.log({ id });
        setCurrentMatrix(() => {
          if (id) {
            console.log("is id !!");
            const id_Matrix = matrixes.data.filter((mtx: any) => mtx["matrixID"] == id)[0];
            console.log({ id_Matrix });
            if (id_Matrix) return id_Matrix;
          }
          return matrixes.data[matrixes.data.length - 1];
        });
      });
    }
    console.log(currentMatrix);
  }, [matrixes.data, render?.data?.login]);

  const responseToSubmitRequest = (value: string, driversData: driver[]) => {
    if (input === "1234") {
      return setRender({ ...renderScreen("admin", render.data) });
    }
    setRender({ ...renderScreen("storage", render.data) });

    const currentDriver = driversData.filter((row) => {
      if (row.password.toString() == value) {
        return row;
      }
    });
    if (currentDriver?.length == 1) {
      setDriver({ data: currentDriver[0] });

      //   localStorage.setItem("driver", JSON.stringify(currentDriver[0]));
    }
  };

  const handleClick = (e: any) => {
    let name = e.target.name;
    let value = input;
    name == "password_btn" && drivers?.data && responseToSubmitRequest(value, drivers.data);
  };

  return (
    <>
      {matrixes?.data?.length == 0 ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="bg-red-600 text-white">אין מטריצות להציג </p>
          <button onClick={() => backToLogin(setRender, render)} className="btn1">
            חזור
          </button>
        </div>
      ) : render?.data?.login && !render?.data?.admin ? (
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
      ) : matrixes.isLoading || castumers.isLoading ? (
        <h1>laoding ....</h1>
      ) : (
        matrixes.error || (castumers.error && <h1>error ....</h1>)
      )}
      {!render.data.login && !driver.data && input !== "1234" && (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="bg-red-600 text-white">נהג לא מזוהה</p>
          <button onClick={() => backToLogin(setRender, render)} className="btn1">
            חזור
          </button>
        </div>
      )}
      {!render?.data?.login &&
        !render?.data?.admin &&
        driver?.data &&
        castumers.data &&
        drivers.data &&
        matrixes?.data?.length &&
        currentMatrix &&
        jobs?.data && (
          <Nav
            jobs={jobs?.data ?? null}
            render={render}
            setRender={setRender}
            user={driver.data}
            matrix={currentMatrix.matrixesData}
            fullMatrix={currentMatrix}
            castumers={castumers.data}
            driver={driver.data.pivotKey}
            //  loginShow={setToShow}
          />
        )}
      {render?.data?.admin && castumers?.data && drivers?.data && matrixes?.data ? (
        <AdminScreen matrixes={matrixes.data} castumers={castumers.data} render={render} setReder={setRender} />
      ) : (
        render?.data?.admin && <h1>loadind admin....</h1>
      )}
    </>
  );
}

const setQueryData = () => {
  const drivers = useQuery({
    queryKey: ["drivers"],
    queryFn: () => fetchDriversData(),
  });
  const jobs = useQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchDriversData("?type=driver_mennager"),
  });
  const castumers = useQuery({
    queryKey: ["castumers"],
    queryFn: fetchCastumersData,
  });
  const matrixes = useQuery({
    queryKey: ["matrixes"],
    queryFn: fetchCurrentDayMarixes,
  });
  return { drivers, castumers, matrixes, jobs };
};

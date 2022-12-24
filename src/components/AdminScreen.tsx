import React, { useEffect, useRef, useState } from "react";
import { createTRPCProxyClient } from "@trpc/client";
import { Query, useQuery } from "@tanstack/react-query";
import { BiMessageAltAdd } from "react-icons/bi";
import { fetchCastumersData, fetchCurrentDayMarixes, fetchDriversData } from "../api";
import Select from "./Select";
import useLocalStorage from "../Hooks/useLocalStorage";
import { backToLogin, constractMissions, Logger } from "../helper";
import Model from "./Model";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
const client = createTRPCProxyClient;

function AdminScreen(props: any) {
  const [matrixesNames] = useLocalStorage(
    "matrixesNames",
    props.matrixes.map((matrix: any) => matrix.matrixName)
  );

  const [tasks, setTasks] = useLocalStorage("tasks", { data: null });
  const [messages, setMessages] = useLocalStorage("messages", { data: null });
  const [selectedName, setSelectedName] = useState();
  const [toggle, toggleModule] = useState(false);
  // const messagesContent = useQuery({
  //   queryKey: ["messages_content"],
  //   queryFn: () => fetchMessaedContent("?type=messages"),
  // });

  Logger(tasks, " tasks in admin screen");

  useEffect(() => {
    if (tasks?.data?.length > 0 && messages?.data === null) {
      console.log("in use EFFECT TASKS !!!!!!!!!!!!!!");
      setMessages({
        data: tasks.data.map((task: any) => {
          return { isExist: false, content: null, id: task["id"] };
        }),
      });
      for (let i = 0; i <= tasks.data.length - 1; i++) {
        fetch(ResApiUrl + `?type=updatemessages&id=${tasks.data.id}&content=${tasks.data.content}`).then((res) =>
          console.log(res.json())
        );
      }
    }
  }, [tasks.data]);
  Logger(messages, "messages");

  const handleSelect = (e: any) => {
    setSelectedName(e.target.value);
  };
  Logger(messages);
  const handleClick = (e: any, idx?: number) => {
    if (idx)
      setMessages({
        data: messages.data.map((msg: any, i: number) => {
          if (i === idx) {
            toggleModule(!toggle);
            console.log("pressed ", { i, idx });
            return { ...msg, isExist: !msg.isExist };
          } else return msg;
        }),
      });
    console.log("clicked");
    if (tasks.data === null) {
      const Rows = constractMissions(
        props.matrixes.filter((matrix: any) => matrix.matrixName === selectedName)[0]["matrixesData"],
        props.castumers,
        "admin"
      );
      setTasks({ data: [...Rows.missions] });
    }
  };

  return (
    <div>
      {!tasks.data && (
        <div className="flex flex-col items-center justify-center h-screen  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <select
            className="shadow appearance-none text-center border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="select"
            //className={"bg-orange-100 align-middle text-5xl text-black"}
            id="pivot"
            onChange={handleSelect}
          >
            <option value={undefined} selected hidden>
              בחר טריצה
            </option>
            {matrixesNames.map((name: any, idx: number) => (
              <option className="text-black text-xl w-1/3" key={idx}>
                {name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold border w-full py-2 px-3 border-blue-700 hover:border-blue-500 rounded"
            onClick={(Event) => handleClick(Event)}
          >
            בחר
          </button>
        </div>
      )}

      {tasks?.data && messages?.data && (
        <div className="flex flex-col items-center justify-center h-full  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="hdr1">
            <h1>משימות יומיות לכלל הנהגים</h1>
            <button
              onClick={() => {
                backToLogin(props.setReder, props.render.data);
              }}
            >
              התנתק
            </button>
            <input type="tel" />
          </div>

          <div className="flex flex-col">
            {tasks?.data.map((task: any, index: number) => (
              <div
                className={
                  "flex flex-wrap items-baseline px-2 py-3 w-4/5 bg-gray-100 shadow-md rounded-md gap-1 touch-none"
                }
              >
                <p className=" flex-1/16 border-2 text-center font-bold border-red-500 ">מזהה:</p>
                <p className=" flex-1/16 text-center">{JSON.stringify(task["id"])}</p>
                <p className="w-15px flex-1/16 self-start border-2 text-center font-bold border-red-500 ">שם:</p>
                <p className="w-40px flex-1/4 text-center">{JSON.stringify(task["שם"])} </p>
                <p className="w-20px flex-1/16 all border-2 text-center font-bold border-red-500 ">נייד</p>
                <p className="w-40px flex-1/16 text-center ">{JSON.stringify(task["נייד"])} </p>
                <BiMessageAltAdd
                  onClick={(Event) => {
                    handleClick(Event, index);
                  }}
                  className={`flex ${messages?.data[index].isExist && "text-green-600"} flex-1/16 justify-self-end`}
                  size={24}
                  //  color={ ? "green" : "black"}
                />
              </div>
            ))}
          </div>
          {toggle && <Model toggleModule={toggleModule} />}
        </div>
      )}
    </div>
  );
}

export default AdminScreen;

export const useGetOtherData = (data: any, setData: any) => {
  let castumers;
  let drivers;
  useEffect(() => {
    drivers = useQuery({
      queryKey: ["drivers"],
      queryFn: fetchDriversData,
    });
    castumers = useQuery({
      queryKey: ["castumers"],
      queryFn: fetchCastumersData,
    });
  }, [data]);

  setData({ ...data, castumers: castumers, drivers: drivers });
};

const useCheckDataState = (data: any, setList: Function, setMissions: Function) => {
  if (data?.matrix?.data && data?.castumers?.data && data?.drivers?.data)
    setMissions(constractMissions(data.matrix, data.castumers, data.drivers));
};
function fetchMessaedContent(arg0: string): any {
  throw new Error("Function not implemented.");
}

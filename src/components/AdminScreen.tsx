import React, { useEffect, useRef, useState } from "react";
import { createTRPCProxyClient } from "@trpc/client";
import { Query, useQuery } from "@tanstack/react-query";
import { BiMessageAltAdd } from "react-icons/bi";
import {
  fetchCastumersData,
  fetchCurrentDayMarixes,
  fetchDriversData,
} from "../api";
import Select from "./Select";
import useLocalStorage from "../Hooks/useLocalStorage";
import { backToLogin, constractMissions, Logger } from "../helper";
import Model from "./Model";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
const udateMessageContent = (idx: any, messages: any) => {
  let data = messages.data.map((msg: any, index: number) => {
    if (idx === index)
      return { ...msg, content: msg.content ? msg.content : "אין הודעה ללקוח" };
    else return msg;
  });
  return { data: data };
};

const udateCurrentContent = (idx: any, messages: any, value: any) => {
  let data = messages.data.map((msg: any, index: number) => {
    if (idx === index) return { ...msg, content: value };
    else return msg;
  });
  return { data: data };
};
const updateMessageIsExist = (messages: any) => {
  console.log("in messsages is exist !!!!!!!");

  return {
    data: messages.data.map((msg: any, i: number) => {
      console.log("msg in ssssssssssss", msg.content);
      return {
        ...msg,
        isExist: msg.content && msg.content != "אין הודעה ללקוח" ? true : false,
      };
    }),
  };
};
const initializeMessages = async (messages: any, setIsInitiated: Function) => {
  console.log("in is initiated function");
  if (messages?.data !== null) {
    setIsInitiated({ data: true });
    for (let i = 0; i <= messages.data.length - 1; i++) {
      console.log("task to update ", messages.data[i]);
      await fetch(
        ResApiUrl +
          "?" +
          encodeURI(
            `type=updatemessages&id=${messages.data[i].id}&content=${messages.data[i].content}`
          ),
        {
          mode: "no-cors",
        }
      ).then((res) => console.log(res));
    }
  }
};

function AdminScreen(props: any) {
  const [matrixesNames] = useLocalStorage(
    "matrixesNames",
    props.matrixes.map((matrix: any) => matrix.matrixName)
  );

  const [tasks, setTasks] = useLocalStorage("tasks", { data: null });
  const [messages, setMessages] = useLocalStorage("messages", { data: null });
  const [selectedName, setSelectedName] = useState();
  const [toggle, toggleModule] = useState(false);
  const [isInitiated, setIsInitiated] = useLocalStorage("isinitiated", {
    data: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  //const [msgContent, setMsgContent] = useState(null);
  // const messagesContent = useQuery({
  //   queryKey: ["messages_content"],
  //   queryFn: () => fetchMessaedContent("?type=messages"),
  // });

  Logger(tasks, " tasks in admin screen");

  useEffect(() => {
    if (messages.data != null)
      setMessages({ ...updateMessageIsExist(messages) });
  }, [toggle]);
  useEffect(() => {
    if (tasks?.data?.length > 0 && messages?.data === null) {
      console.log("in use EFFECT TASKS !!!!!!!!!!!!!!");
      setMessages({
        data: tasks.data.map((task: any) => {
          return { isExist: false, content: null, id: task["id"] };
        }),
      });
    }
    if (!isInitiated.data) {
      console.log("in is initiated use effect");
      initializeMessages(messages, setIsInitiated);
    }
    console.log({ messages });
  }, [tasks.data, messages.data]);
  Logger(messages, "messages");

  const handleSelect = (e: any) => {
    setSelectedName(e.target.value);
  };

  const handleClick = (e: any, idx?: number) => {
    console.log({ e });
    if (idx || idx === 0) {
      setCurrentIndex(idx);
      toggleModule(!toggle);

      setMessages(udateMessageContent(idx, messages));
      console.log("before messages is exist !!!!!!!!", {});
    }
    if (tasks.data === null) {
      const Rows = constractMissions(
        props.matrixes.filter(
          (matrix: any) => matrix.matrixName === selectedName
        )[0]["matrixesData"],
        props.castumers,
        "admin"
      );
      setTasks({ data: [...Rows.missions] });
    }
  };

  const handleChange = (e: any) => {
    // update msegggahsdjalskdas
    const value =
      e.target.value == "אין הודעה ללקוח" ||
      e.target.value == null ||
      e.target.value == ""
        ? null
        : e.target.value;
    if (e.target.id == "msgContent")
      setMessages(udateCurrentContent(currentIndex, messages, value));
  };

  return (
    <div className="w-screen h-screen">
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
          {!toggle && (
            <div className="hdr2 justify-between">
              <h1>משימות יומיות לכלל הנהגים</h1>
              <button
                onClick={() => {
                  backToLogin(props.setReder, props.render.data);
                }}
              >
                התנתק
              </button>
            </div>
          )}

          <div className="flex flex-col w-4/5 mt-20">
            {tasks?.data.map((task: any, index: number) => (
              <div
                className={
                  "flex flex-wrap items-baseline  px-4 py-3 w-4/5 bg-gray-100 shadow-md rounded-md gap-2 touch-none"
                }
              >
                <p className=" flex-1/16 border-2 text-center font-bold border-red-500 ">
                  מזהה:
                </p>
                <p className=" flex-1/16 text-center">
                  {JSON.stringify(task["id"])}
                </p>
                <p className="w-15px flex-1/16 self-start border-2 text-center font-bold border-red-500 ">
                  שם:
                </p>
                <p className="w-40px flex-1/4 text-center">
                  {JSON.stringify(task["שם"])}{" "}
                </p>
                <p className="w-20px flex-1/16 all border-2 text-center font-bold border-red-500 ">
                  נייד
                </p>
                <p className="w-40px flex-1/16 text-center ">
                  {JSON.stringify(task["נייד"])}{" "}
                </p>
                <BiMessageAltAdd
                  onClick={(Event) => {
                    handleClick(Event, index);
                  }}
                  className={`flex ${
                    messages?.data[index].isExist && "text-green-600"
                  } flex-1/16 justify-self-end`}
                  size={24}
                  //  color={ ? "green" : "black"}
                />
              </div>
            ))}
          </div>
          {toggle && (
            <Model
              header={"הודעה ללקוח"}
              toggleModule={toggleModule}
              handleChange={handleChange}
              msgContent={messages.data[currentIndex]}
              taskData={tasks.data[currentIndex]}
            />
          )}
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

const useCheckDataState = (
  data: any,
  setList: Function,
  setMissions: Function
) => {
  if (data?.matrix?.data && data?.castumers?.data && data?.drivers?.data)
    setMissions(constractMissions(data.matrix, data.castumers, data.drivers));
};
function fetchMessaedContent(arg0: string): any {
  throw new Error("Function not implemented.");
}

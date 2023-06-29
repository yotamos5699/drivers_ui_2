import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery } from "@tanstack/react-query";
import { BiMessageAltAdd } from "react-icons/bi";
import { FaSms } from "react-icons/fa";
import { fetchCastumersData, fetchDriversData, setMatrixUrl } from "../api";

import useLocalStorage from "../Hooks/useLocalStorage";
import { backToLogin, constractMissions, Logger } from "../helper";
import Model from "./Model";
import axios from "axios";
import {
  constructSmses,
  getMessageEnd,
  initializeMessages,
  udateCurrentContent,
  udateMessageContent,
  updateMessageInDB,
  updateMessageIsExist,
} from "./utils/messages";
const saveSelectedMatrixID = async (id: any) => {
  const res = await axios(ResApiUrl2 + "?type=currentid&id=" + id, {
    withCredentials: false,
  });
  console.log(res.data);
  // fetch(setMatrixUrl + "?type=currentid&id=" + id);
};

// src/components/AdminScreen.tsx(377,7): error TS2769: No overload matches this call.
//   The last overload gave the following error.
//     Argument of type '{ queryKey: string[]; queryFn: (params?: string) => Promise<any>; }' is not assignable to parameter of type 'QueryKey'.
//       Object literal may only specify known properties, and 'queryKey' does not exist in type 'readonly unknown[]'.

const ResApiUrl2 = "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
const dMessagesUrl =
  "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec?type=defaultMessages";
// const updateSelectetedMatrixID = async (selectedName: string, matrixList: any) => {
//   console.log({ matrixList, selectedName });
//   console.log("first character ", selectedName[0]);
//   const selectedMtx = matrixList.filter(
//     (matrix: any) => matrix.matrixName.trim() === selectedName.trim() || matrix.matrixName == " " + selectedName || selectedName + " "
//   )[0];

//   console.log({ selectedMtx });
//   const id = selectedMtx.matrixID;
//   const res = await axios(ResApiUrl2 + "?type=currentid&id=" + id, {
//     withCredentials: false,
//   });
//   console.log(res.data);
// };
const getDefaultMessages = async () =>
  await axios(dMessagesUrl, {
    withCredentials: false,
  })
    .then((res) => res.data)
    .catch((err) => console.log({ err }));

// fetch(setMatrixUrl + "?type=currentid&id=" + id);

function AdminScreen(props: any) {
  const [matrixesNames] = useLocalStorage(
    "matrixesNames",
    props.matrixes.map((matrix: any) => matrix.matrixName)
  );

  const [tasks, setTasks] = useLocalStorage("tasks", { data: null });
  const [messages, setMessages] = useLocalStorage("messages", { data: null });
  const [selectedName, setSelectedName] = useState();
  const [generalMessage, setGeneralMessage] = useState("");
  const [toggle, toggleModule] = useState(false);
  const [sms, setSms] = useState<any[]>();
  const [isInitiated, setIsInitiated] = useLocalStorage("isinitiated", {
    data: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const msgEnd = useQuery({ queryKey: ["qkey"], queryFn: getMessageEnd });
  useInitiateAdminScreen({
    messages,
    setMessages,
    toggle,
    isInitiated,
    setIsInitiated,
    tasks,
    setSms,
  });
  Logger(tasks, " tasks in admin screen");
  Logger(messages, "messages");

  const handleSelect = (e: any) => {
    setSelectedName(e.target.value);
  };

  const handleClick = (e: any, idx?: number) => {
    if (e.target.id == "generalMessage") updateMessageInDB(generalMessage, "12345678");
    console.log({ e });
    if (idx || idx === 0) {
      setCurrentIndex(idx);
      toggleModule(!toggle);
      setMessages(udateMessageContent(idx, messages));
    }
    if (tasks.data === null && selectedName) {
      const selectedMatrix = props.matrixes.filter((matrix: any) => {
        // @ts-ignore
        return (
          matrix.matrixName.trim().replace("  ", " ") ===
          //@ts-ignore
          selectedName.trim().replace("  ", " ")
        );
      })[0];
      console.log("in handle click !!!", { selectedMatrix });

      saveSelectedMatrixID(selectedMatrix.matrixID);
      const Rows = constractMissions(selectedMatrix["matrixesData"], props.castumers, "admin");
      setTasks({ data: [...Rows.missions] });
    }
  };

  const handleChange = (e: any) => {
    // update msegggahsdjalskdas
    const value = e.target.value == "אין הודעה ללקוח" || e.target.value == null || e.target.value == "" ? null : e.target.value;
    if (e.target.id == "msgContent") setMessages(udateCurrentContent(currentIndex, messages, value));
  };

  return (
    <div className="w-full h-full border-blue-600 border-4">
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
            onClick={(Event) => {
              // selectedName && updateSelectetedMatrixID(selectedName, props.matrixes);
              handleClick(Event);
            }}
          >
            בחר
          </button>
        </div>
      )}
      <div></div>
      {tasks?.data && messages?.data && (
        <div className="flex flex-col items-center justify-center h-full w-screen  bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4  border-blue-600 border-4">
          {!toggle && (
            <div className="flex flex-col">
              <div className="hdr2 justify-between">
                <h1>משימות יומיות לכלל הנהגים</h1>
                <ClipLoader
                  color={"blue"}
                  loading={!isInitiated.data}
                  //cssOverride={override}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />

                <button
                  className={sms?.filter((s: any) => s === true)[0] ? "btn1 w-32 bg-green-600" : "btn1 w-32 bg-gray-600 "}
                  onClick={() => {
                    console.log(selectedName);
                    console.log("props matrixes ", props.matrixes);
                    sms?.filter((s: any) => s === true)[0] &&
                      constructSmses(
                        sms,
                        tasks.data,
                        props.matrixes.filter((matrix: any) => matrix.matrixName === selectedName)[0]["matrixesData"]["mainMatrix"],
                        msgEnd.data
                      );
                  }}
                >
                  שלח הודעות
                </button>
                <button
                  className="btn1 w-32"
                  onClick={() => {
                    backToLogin(props.setReder, props.render.data);
                  }}
                >
                  התנתק
                </button>
              </div>
            </div>
          )}
          <div className="mt-3">
            {tasks?.data && (
              <div className="flex  border-red-500 border-2">
                <button onClick={handleClick} id={"generalMessage"} className="btn1 h-full w-2/12">
                  עדכן
                </button>
                <input
                  onChange={(e: any) => {
                    setGeneralMessage(e.target.value);
                  }}
                  value={generalMessage}
                  className="text-center border-blue-500 text-2xl border-2 w-10/12"
                  type={"text"}
                  placeholder={"הודעה כללית למחסן"}
                />
              </div>
            )}
            {tasks?.data.map((task: any, index: number) => (
              <div className={"flex  items-baseline  px-4 py-3 w-4/5 bg-gray-100 shadow-md rounded-md gap-2 touch-none "}>
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
                <FaSms
                  className={sms !== undefined && sms[index] ? "flex-1/16 text-green-600" : "flex-1/16 justify-self-end"}
                  size={24}
                  onClick={() => {
                    console.log({ sms });
                    setSms(
                      sms?.map((s: any, i: number) => {
                        if (i == index) return !s;
                        else return s;
                      })
                    );
                  }}
                />
              </div>
            ))}
          </div>

          {toggle && (
            <div>
              <Model
                header={"הודעה ללקוח"}
                toggleModule={toggleModule}
                handleChange={handleChange}
                msgContent={messages.data[currentIndex]}
                taskData={tasks.data[currentIndex]}
              />
            </div>
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
    castumers = useQuery({
      queryKey: ["castumers"],
      queryFn: fetchCastumersData,
    });
  }, [data]);

  setData({ ...data, castumers: castumers, drivers: drivers });
};

const useInitiateAdminScreen = (props: any) => {
  useEffect(() => {
    if (props.messages.data != null) props.setMessages({ ...updateMessageIsExist(props.messages) });
  }, [props.toggle]);
  useEffect(() => {
    if (props.tasks?.data?.length > 0 && props.messages?.data === null) {
      console.log("in use EFFECT TASKS !!!!!!!!!!!!!!");
      props.setMessages({
        data: props.tasks.data.map((task: any) => {
          return { isExist: false, content: null, id: task["id"] };
        }),
      });
    }
    if (!props.isInitiated.data && props.messages.data != null) {
      console.log("in is initiated use effect");
      initializeMessages(props.messages, props.setIsInitiated, props.setMessages);
    } else {
      console.log("smsss data 111");
      props.setSms(props.messages?.data?.map((msg: any) => false));
    }
    // console.log({ messages });
  }, [props.tasks.data, props.messages.data]);
};

// const useCheckDataState = (data: any, setList: Function, setMissions: Function) => {
//   if (data?.matrix?.data && data?.castumers?.data && data?.drivers?.data)
//     setMissions(constractMissions(data.matrix, data.castumers, data.drivers));
// };
// function fetchMessaedContent(arg0: string): any {
//   throw new Error("Function not implemented.");
// }

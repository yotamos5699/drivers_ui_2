import { Query, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchDriverSummary } from "../api";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";
const updateMessage = async (message: any) => {
  await fetch(ResApiUrl + "?" + encodeURI(`type=updatemessages&id=${message.id}&content=${message.content}`), {
    mode: "no-cors",
  }).then((res) => console.log(res));
};

function Model(props: any) {
  return (
    <div
      id="pop_up"
      className={
        " flex-col fixed h-full inset-4 bg-slate-900 bg-opacity-30 text-5xl backdrop-blur-sm flex justify-center items-center"
      }
    >
      <div id="pop_up_text" className={"w-4/5 h-30 bg-white p-2 rounded"}>
        <div className="flex text-xl  bg-gray-300">
          <p className="text-xl">{props.header} </p>
          <p>{props.taskData["שם"]}</p>
        </div>
        <textarea
          id="msgContent"
          value={props.msgContent.content}
          onChange={props.handleChange}
          rows={4}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="כתבי הודעה פה..."
        ></textarea>
        {/* <input
          id="msgContent"
          className="h-full w-full  text-center text-xl border-blue-500 border-2 overflow-x-visible"
          value={props.msgContent}
          onChange={props.handleChange}
          type={"text"}
        ></input> */}
      </div>
      <button
        className="btn1"
        onClick={() => {
          props.toggleModule((prev: any) => !prev);
          updateMessage(props.msgContent);
        }}
      >
        סיום
      </button>
    </div>
  );
}

export default Model;

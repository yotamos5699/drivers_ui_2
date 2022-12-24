import { Query, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchDriverSummary } from "../api";

function Model(props: any) {
  return (
    <div
      id="pop_up"
      className={
        "fixed h-full inset-4 bg-slate-900 bg-opacity-30 text-5xl backdrop-blur-sm flex justify-center items-center"
      }
      onClick={() => props.toggleModule((prev: any) => !prev)}
    >
      <div id="pop_up_text" className={"bg-white p-2 rounded"}></div>
    </div>
  );
}

export default Model;

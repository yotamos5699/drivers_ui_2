import { Query, useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchDriverSummary } from "../api";

function Model(props: {
  handleClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}) {
  const driverSummary = useQuery({
    queryKey: ["driversummary"],
    queryFn: fetchDriverSummary,
  });

  return (
    <div
      id="pop_up"
      className={
        "fixed h-full inset-4 bg-slate-900 bg-opacity-30 text-5xl backdrop-blur-sm flex justify-center items-center"
      }
      onClick={props.handleClick}
    >
      {driverSummary.isLoading && <h1>loading...</h1>}
      {driverSummary.error && <h1> error !!!</h1>}
      {driverSummary.data && (
        <div id="pop_up_text" className={"bg-white p-2 rounded"}>
          {JSON.stringify(driverSummary.data)}
        </div>
      )}
    </div>
  );
}

export default Model;

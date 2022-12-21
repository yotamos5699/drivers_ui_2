import React, { useEffect, useRef, useState } from "react";
import { createTRPCProxyClient } from "@trpc/client";
import { Query, useQuery } from "@tanstack/react-query";
import { fetchCastumersData, fetchCurrentDayMarixes, fetchDriversData } from "../api";
import Select from "./Select";
import useLocalStorage from "../Hooks/useLocalStorage";
import { constractMissions } from "../helper";

const client = createTRPCProxyClient;

function AdminScreen() {
  const [missions, setMissions] = useLocalStorage("missions", { data: null });
  const [selectVal, setSelectVal] = useState();
  const [data, setData] = useState({ matrix: null, castumers: null, drivers: null });
  const [list, setList] = useState(false);
  const Matrixes = useQuery({ queryKey: ["dayMatrixes"], queryFn: fetchCurrentDayMarixes });
  if (Matrixes.isLoading) return <h1>is loading...</h1>;
  if (Matrixes.error) return <h1>error...</h1>;

  const handleSelect = (e: any) => {
    if (e.target.name == "select") setSelectVal(e.target.value);
  };
  useGetOtherData(data.matrix, setData);
  useCheckDataState(data, setList, setMissions);
  const handleClick = () => {
    setData({ ...data, matrix: Matrixes.data.filter((matrix: any) => matrix.matrixName === selectVal) });
  };

  return (
    <div>
      <select
        name="select"
        //className={"bg-orange-100 align-middle text-5xl text-black"}
        id="pivot"
        onChange={handleSelect}
      >
        <option value={undefined} selected hidden>
          בחר טריצה
        </option>
        {Matrixes.data.map((item: any, idx: number) => (
          <option className="text-black text-xl w-1/3" key={idx}>
            {item.matrixName}
          </option>
        ))}
      </select>
      <button onClick={handleClick}>בחר</button>
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

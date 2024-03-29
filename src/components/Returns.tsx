import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItemsData } from "../api";
import Select from "./Select";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";
import { FiDelete } from "react-icons/fi";
import Missions from "./Missions";
type ReturnsProps = {
  castumer?: any;
  handleClick: any;
  mission?: any;
};

function Returns(props: ReturnsProps) {
  const [list, setList] = useState<any>();
  const [selectionStatus, setSelectionStatus] = useState<boolean>(false);
  const [mennagers] = useState<{ data: any[] } | null>(() => {
    const Mennagers = localStorage.getItem("mennagers");
    if (Mennagers) return JSON.parse(Mennagers);
    else {
      setSelectionStatus(true);
      return null;
    }
  });

  const items = useQuery({ queryKey: ["items"], queryFn: fetchItemsData });
  if (items.isLoading) return <h1>loading</h1>;
  if (items.error) return <h1>error</h1>;
  // if (items.data) console.log("items=> data ", items.data);

  const handleClick = (e: any, idx: number, action: string) => {
    console.log("added row ", { e });

    if (action == "add") {
      if (e.amount != "0" && e.item != "" && typeof idx != "number") {
        let newList = list ? list : [];
        newList.push({ ...e, id: Math.floor(Math.random() * 1000) });
        setList([...newList]);
      }
    }
    console.log({ action });
    if (action == "del") {
      let ln = list?.length;
      let newL = list.filter((item: any) => item.id != idx);
      setList([...newL]);

      if (ln == 1) {
        console.log("reseting list");
        setList(null);
      }
    }

    console.log({ list, idx });
  };

  return (
    <div>
      {items?.data && selectionStatus ? (
        <div>
          <Select items={items.data} handleClick={handleClick} />
          {list &&
            list.map((item: any, idx: number) => (
              <div key={idx} className="flex w-full border-b-2 border-gray-500 p-4">
                <div className="w-1/3">{item.item}</div>
                <div className="w-1/3">{item.amount}</div>
                <FiDelete id="delete" onClick={(Event) => handleClick(Event, item.id, "del")} className="w-1/3" />
              </div>
            ))}
        </div>
      ) : (
        mennagers && (
          <select
            className="flex shadow appearance-none text-center border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="select"
            //className={"flex bg-orange-100 align-middle text-5xl text-black"}
            id="pivot"
            onChange={(Event) => {
              setSelectionStatus(true);
            }}
          >
            <option value={undefined} selected hidden>
              מי מאשר את החזרת הסחורה ?
            </option>
            {mennagers.data.map((driver: any, idx: number) => (
              <option className="text-black text-xl w-1/3" key={idx}>
                {driver}
              </option>
            ))}
          </select>
        )
      )}
      <div>
        <button id="main" className="btn1" onClick={props.handleClick}>
          חזור
        </button>
        {list && (
          <button name="sub" id="main" className="btn1" onClick={(Event) => props.handleClick(Event, { list: list })}>
            הפק
          </button>
        )}
      </div>
    </div>
  );
}
export default Returns;

function Row() {
  return (
    <div className="flex">
      <input type="number" />
      <GrAddCircle />
      <GrSubtractCircle />
    </div>
  );
}

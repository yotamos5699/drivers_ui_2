import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItemsData } from "../api";
import Select from "./Select";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";
import { FiDelete } from "react-icons/fi";
type ReturnsProps = {
  castumer?: any;
  handleClick: any;
};

function Returns(props: ReturnsProps) {
  const [list, setList] = useState<any>();

  const items = useQuery({ queryKey: ["items"], queryFn: fetchItemsData });
  if (items.isLoading) return <h1>loading</h1>;
  if (items.error) return <h1>error</h1>;
  // if (items.data) console.log("items=> data ", items.data);

  const handleClick = (e: any, idx: number) => {
    if (e.amount != "0" && e.item != "" && typeof idx != "number") {
      let newList = list ? list : [];
      newList.push({ ...e });
      setList([...newList]);
    }
    if (idx) {
      let newL = list.filter((item: any, i: number) => i != idx);
      setList([...newL]);
    }
    console.log({ e, idx });
  };

  return (
    <div>
      {items.data && (
        <div>
          <Select items={items.data} handleClick={handleClick} />
          {list &&
            list.map((item: any, idx: number) => (
              <div key={idx} className="flex w-full border-b-2 border-gray-500 p-4">
                <div className="w-1/3">{item.item}</div>
                <div className="w-1/3">{item.amount}</div>
                <FiDelete id="delete" onClick={() => handleClick(Event, idx)} className="w-1/3" />
              </div>
            ))}
        </div>
      )}
      <div>
        <button id="main" className="btn1" onClick={props.handleClick}>
          חזור
        </button>
        {list && (
          <button name="sub" id="main" className="btn1" onClick={props.handleClick}>
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

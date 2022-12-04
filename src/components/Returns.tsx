import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItemsData } from "../api";
import Select from "./Select";
import { GrAddCircle, GrSubtractCircle } from "react-icons/gr";

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

  const handleClick = (e: any) => {
    if (e.amount != "0" && e.item != "") {
      let newList = list ? list : [];
      newList.push({ ...e });
      setList([...newList]);
    }

    console.log({ e });
  };

  return (
    <div>
      {items.data && (
        <div>
          <Select items={items.data} handleClick={handleClick} />
          {list &&
            list.map((item: any, idx: number) => (
              <div key={idx} className="flex">
                <div>{item.item}</div>
                <div>{item.amount}</div>
                <div>מחק</div>
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

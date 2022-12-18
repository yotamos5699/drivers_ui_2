import React, { useState } from "react";

function Select(props: any) {
  const [selectVal, setSelectVal] = useState({
    amount: 0,
    item: "",
  });
  const handleSelect = (e: any) => {
    if (e.target.name == "select") setSelectVal({ ...selectVal, item: e.target.value });
    if (e.target.name == "amount") setSelectVal({ ...selectVal, amount: e.target.value });
    console.log("e in select ", { e });
    console.log(e.target.value);
    console.log({ selectVal });
  };
  return (
    <div className="flex">
      <select
        name="select"
        //className={"bg-orange-100 align-middle text-5xl text-black"}
        id="pivot"
        onChange={handleSelect}
      >
        <option value={undefined} selected hidden>
          בחר פריטים
        </option>
        {props.items.map((item: any, idx: number) => {
          return (
            <option className="text-black text-xl w-1/3" key={idx}>
              {item["שם פריט"]}
            </option>
          );
        })}
      </select>
      <input
        name="amount"
        type="number"
        value={selectVal.amount}
        onChange={handleSelect}
        placeholder="כמות"
        className="text-center w-1/3"
      ></input>
      <button id={"add"} className="btn1 w-1/3" onClick={() => props.handleClick(selectVal, "", "add")}>
        הוסף
      </button>
    </div>
  );
}

export default Select;

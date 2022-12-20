import React, { useEffect, useState } from "react";

const getSavedValue = (key: string, initialValue: any) => {
  const storageType = localStorage.getItem(key);
  console.log({ key });
  if (storageType) {
    console.log("found local storage ", { storageType });
    const parsedValue = JSON.parse(storageType);
    return parsedValue;
  }
  if (initialValue instanceof Function) return initialValue();
  return initialValue;
};

type LsValue = {
  data: any;
  subKey?: string | null;
};
const useLocalStorage = (key: string, initialValue: LsValue) => {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  console.log("key in render ", { key });
  //
  useEffect(() => {
    if (value?.subKey == "details" || value?.subKey == "log") {
      console.log("foiden key ", { key });
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);
  console.log("before return ", { value });
  return [value, setValue];
};

export default useLocalStorage;

import { useEffect, useState } from "react";
type localDataProps = {
  missions: any[];
};

export function updateLocalData(props: any) {
  const [localData, setLocalData] = useState({
    matrix: undefined,
    ussers: undefined,
    missions: undefined,
  });

  useEffect(() => {
    window.localStorage.setItem("data", JSON.stringify(localData));
  }, [localData]);

  useEffect(() => {
    if (localData.missions != "undefined") setLocalData([...props.missions]);
  }, [props.missions]);

  return;
}

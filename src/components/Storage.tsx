import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useContext } from "react";
import { fetchItemsData, fetchItemsDataWeight } from "../api";
import { Logger } from "../helper";
import useLocalStorage from "../Hooks/useLocalStorage";

//import DataRow fro
type StorageProps = {
  matrix: any;
  filterdKeys: string[];
  missions: any;
  castumers: any;
  handleGlobalRender: any;
  setStorageHeaders: any;
};

function Storage(props: StorageProps) {
  const [storageData, setStorageData] = useLocalStorage("storageData", { data: null, subKey: "storageData" });
  const [storageStyles, setStorageStyles] = useLocalStorage("storageStyles", { data: null, subKey: "storageStyles" });
  const [storageAddedSpecs, setStorageAddedSpecs] = useLocalStorage("sorageAddedSpecs", {
    data: { itemsWeight: null },
  });
  const itemsData = useQuery({ queryKey: ["itemsData"], queryFn: fetchItemsData });
  itemsData.data &&
    storageAddedSpecs.data.itemsWeight == null &&
    storageData?.data?.length &&
    calcItemsWeight(itemsData.data, storageData.data, setStorageAddedSpecs);

  // const [render, setReder] = useState({
  //   main: true,
  //   cont: false,
  // });
  console.log("sorage props :", { props });
  useEffect(() => {
    if (storageData.data !== null)
      props.setStorageHeaders({
        data: { headers: Object.keys(storageData.data[0]), amount: storageData?.data?.length },
      });
    // if (itemsData.data && storageData.data != null && storageAddedSpecs.data.itemsWeight == null)
    //   calcItemsWeight(itemsData.data, storageData.data, setStorageAddedSpecs);
  }, [storageData.data]);

  useEffect(() => {
    if (storageData.data && storageStyles.data) {
      props.setStorageHeaders({
        data: { headers: Object.keys(storageData.data[0]), amount: storageData?.data?.length },
      });
      return;
    }

    let AccountKeys = props.filterdKeys;
    let AccountNames = AccountKeys.map((Account: any) => {
      let card: any[] = props.castumers.filter((cas: any) => cas["מפתח"] == Account);

      return card[0]["שם חשבון"];
    });

    let cellsData = props.matrix.mainMatrix.cellsData;
    let itemsNames: any[] = props.matrix.mainMatrix.itemsNames;
    console.log({ itemsNames });
    if (itemsNames[0] != "לקוח") {
      itemsNames.unshift("לקוח");
    }
    let record: any = {};
    let innerArray;
    let details = [];
    let stMtx: boolean[][] = [];
    let AllMatrixKeys = props.matrix.mainMatrix.AccountKey;
    try {
      for (let i = 0; i <= AccountKeys.length - 1; i++) {
        record = {};
        innerArray = [];
        innerArray.push(false);
        for (let x = 0; x <= AllMatrixKeys.length - 1; x++) {
          if (AccountKeys[i] == AllMatrixKeys[x]) {
            record[itemsNames[0]] = AccountNames[i];
            for (let j = 1; j <= itemsNames.length - 1; j++) {
              record[itemsNames[j]] = cellsData[x][j - 1];
              innerArray.push(false);
            }

            record["isDone"] = false;
            details.push(record);
            console.log({ record });
            innerArray.length > 0 && stMtx.push(innerArray);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
    if (stMtx) {
      setStorageStyles({ ...storageStyles, data: stMtx });
    }
    record && setStorageData({ ...storageData, data: details });
  }, []);

  const handleChange = (e: any, p: any) => {
    if (e.target.id == "isDone") {
      let rowIndex = 0;
      let newData = storageData.data.map((row: any, idx: number) => {
        if (idx == p) {
          rowIndex = idx;
          return { ...row, isDone: !row["isDone"] };
        } else return row;
      });

      let sortedData: any = [];
      let mtx: any = [];

      newData.forEach((row: object, i: number) => {
        if (i != rowIndex) {
          mtx.push(storageStyles.data[i]);
          sortedData.push(row);
        }
      });

      if (newData[rowIndex]["isDone"] == true) {
        sortedData.push(newData[rowIndex]);
        mtx.push(storageStyles.data[rowIndex]);
      } else {
        sortedData.unshift(newData[rowIndex]);
        mtx.unshift(storageStyles.data[rowIndex]);
      }
      setStorageData({ data: [...sortedData] });
      setStorageStyles({ data: [...mtx] });
    }
  };

  // useEffect(() => {

  //   console.log("in use effect for loging weighet !!!!!!");
  // }, [itemsData.data, storageData.data]);
  return (
    <div className="mt-56">
      {storageData?.data && (
        <table>
          {/* <thead className="bg-white border-b">
           
          </thead> */}
          <tbody>
            {storageData.data.map((row: any, idx: number) => (
              <tr
                key={idx + 3434}
                className={row["isDone"] == false ? "tr" : "tr bg-gray-200"}
                onClick={(e) => handleChange(e, row)}
              >
                {Object.values(row).map(
                  (cell: any, ci) =>
                    Object.keys(row)[ci] != "isDone" && (
                      <td
                        key={ci + idx}
                        onClick={() => {
                          if (storageStyles.data != undefined) {
                            let nm = storageStyles.data;
                            // console.log(nm[idx][ci]);
                            //  console.log({ idx, ci });
                            nm[idx][ci] = !nm[idx][ci];
                            setStorageStyles({ data: [...nm] });
                          }
                        }}
                        /*@ts-ignore */
                        className={
                          storageStyles.data[idx][ci] == false ? "td " : ci != 0 && "td bg-green-600 text-white"
                        }
                      >
                        {cell}
                      </td>
                    )
                )}
                <td className={"td3"}>
                  {storageAddedSpecs?.data?.itemsWeight
                    ? storageAddedSpecs.data.itemsWeight
                        .filter((num: any) => num.castumer == row["לקוח"])[0]
                        .weighet.toFixed(2)
                    : "מחשב"}
                </td>
                <td className={"td"}>
                  <input
                    className="w-6 h-6 justify-center text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    id="isDone"
                    type={"checkbox"}
                    onChange={(e: any) => handleChange(e, idx)}
                    checked={row["isDone"]}
                  />
                </td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      )}
      {!storageData?.data?.filter((row: any) => row.isDone === false)[0] && (
        <button className={"btn1"} id="stockReady" onClick={props.handleGlobalRender}>
          המשך
        </button>
      )}
    </div>
  );
}

export default Storage;
function calcRowItemsWeight(itemsData: any[], storageData: any) {
  let amount: number = 0;
  Object.keys(storageData).forEach((key: string) => {
    key != "לקוח" &&
      itemsData.forEach((item) => {
        item["שם פריט"] == key;
        amount += item["משקל"] * storageData[key];
      });
  });
  return amount;
}

function calcItemsWeight(itemsData: any[], storageData: any[], setStorageAddedSpecs: any) {
  let itemsToWeight = [];

  for (let i = 0; i <= storageData.length - 1; i++) {
    let record: any = {};
    record["weighet"] = 0;
    Object.keys(storageData[i]).forEach((key: string) => {
      if (key == "לקוח") {
        record["castumer"] = storageData[i][key];
      } else {
        itemsData.forEach((item) => {
          if (item["שם פריט"] == key) record["weighet"] += item["משקל"] * storageData[i][key];
        });
      }
    });

    itemsToWeight.push(record);
  }

  setStorageAddedSpecs({ data: { itemsWeight: [...itemsToWeight] } });
  //itemsToWeight;
}

// // "{"data":[
// //   {"לקוח":"דני אדרי","גת XP":3,"קימבו גדול":0,"הרנה 250 גרם":0,"אבו מיסמר גדול":0,"isDone":true},

// // יתרה כמותית במלאי
// // :
// // 9
// // מחסן
// // :
// // 1
// מפתח פריט
// :
// "XP100SA"
// מפתח פריט אב
// :
// "XP100BG"
// משקל
// :
// 0.1
// קוד מיון
// :
// 53000
// שם פריט
// :
// "גת XP"
// שם פריט אב
// :
// "שקית לגת XP100"
// תרה כמותית אב
// :
// -21855.5
// {"result":{"status":"yes","data":[{"_id":"63ac922f6ce5bee9e1f8710c","Date":"2022-12-29T00:00:00.000Z","matrixID":"4d6dc31e778cbdac37447475f9c3aca0182bf102c39bc9648d45826319b7331d","matrixName":"חמישי דרום שרון ומרכז 29/12","userID":"6358f8717dd95eceee53eac3","matrixesData":{"mainMatrix":{"matrixID":"4d6dc31e778cbdac37447475f9c3aca0182bf102c39bc9648d45826319b7331d","ActionID":[1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1],"AccountKey":["6247","6107","6027","6051","6054","6104","6280","6268","6323","6224","6326","6332","6201","6028","6110","6234","6077","6256","6298","6235","6307","6292","6258","6026","6047","6254","6043","6284","6025","6053","6030"],"DocumentID":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"DriverID":["pewr1778256edrf","pewr1778256edrf","m66h4_TY&*fopkr","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","pewr1778256edrf","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh","m66h4_TY&*fopkr","msgfr6_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","pewr1778256edrf","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","msgfr6_TY&*ghkjh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh","66jh6_TY&*gsejh","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","m66h4_TY&*fopkr","msgfr6_TY&*ghkjh","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh"],"ActionAutho":["Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default"],"itemsHeaders":["XP100SA","XR100SA","SP250SA","SX250SA","KI250SA","KI100SA","HI250SA","AB500SA","AB250SA"],"itemsNames":["גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן"],"cellsData":[[5,0,5,0,15,0,2,4,0],[1,1,1,0,2,2,0,0,0],[5,2,2,0,20,2,5,0,2],[2,2,2,0,0,5,0,0,2],[5,2,2,0,0,5,0,0,5],[0,0,0,0,15,0,0,0,0],[2,2,0,0,2,2,2,0,2],[5,5,10,0,10,10,5,2,2],[2,2,0,0,3,3,0,0,2],[2,2,5,0,4,6,0,8,0],[2,2,2,0,0,2,0,0,2],[3,3,2,2,10,6,0,15,6],[0,0,0,0,20,0,20,10,0],[5,5,10,5,25,10,5,15,5],[5,0,5,0,2,2,2,2,0],[3,3,0,0,0,10,0,0,5],[2,2,5,2,0,5,0,0,2],[0,0,5,0,0,4,0,0,0],[0,0,0,0,0,0,0,5,0],[2,0,0,0,2,2,2,0,0],[2,2,2,0,2,2,2,0,2],[2,0,0,0,0,0,3,0,0],[2,2,5,0,0,2,0,0,0],[5,0,5,0,0,5,2,0,0],[0,0,0,0,13,0,7,2,0],[2,2,5,0,2,0,3,0,2],[0,0,3,0,20,5,5,0,2],[0,0,5,0,10,2,5,0,2],[0,0,0,0,6,0,0,1,0],[5,5,10,0,0,5,0,0,5],[0,0,0,0,2,2,2,0,2]]},"changesMatrix":{"matrixConfig":null,"matrixGlobalData":null,"cellsData":[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],"docData":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"metaData":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}},"matrixesUiData":"[[[\"שם לקוח\",\"מזהה\",\"טלפון\",\"גת XP\",\"גת XR\",\"גת SP מובחר\",\"גת SPXP\",\"קימבו גדול\",\"קימבו קטן\",\"הרנה 250 גרם\",\"אבו מיסמר גדול\",\"אבו מיסמר קטן\",\"סוג מסמך\",\"איסוף\",\"מאושר\",\"מידע למסמך\",\"\"],[\"התימניה\",\"6247\",\"544421862\",5,0,5,0,15,0,2,4,0,1,\"pewr1778256edrf\",1,0,0],[\"בונבון משה שון צרפתי\",\"6107\",\"547397871\",1,1,1,0,2,2,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"רגע מתוק\",\"6027\",\"503303738\",5,2,2,0,20,2,5,0,2,1,\"m66h4_TY&*fopkr\",1,0,0],[\"הצומת של אריק\",\"6051\",\"522255577\",2,2,2,0,0,5,0,0,2,1,\"66jh6_TY&*gsejh\",1,0,0],[\"הבית של הגת\",\"6054\",\"528979242\",5,2,2,0,0,5,0,0,5,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בר ליאור\",\"6104\",\"549385483\",0,0,0,0,15,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"הפינה של דוד\",\"6280\",\"542285227\",2,2,0,0,2,2,2,0,2,1,\"pewr1778256edrf\",1,0,0],[\"יואב\",\"6268\",\"527737771\",5,5,10,0,10,10,5,2,2,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"הפינה של כדורי\",\"6323\",\"505063692\",2,2,0,0,3,3,0,0,2,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"בן חיים פז וטל בע\\\"מ\",\"6224\",\"546766824\",2,2,5,0,4,6,0,8,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"אריה חתוכה\",\"6326\",\"0505282481\",2,2,2,0,0,2,0,0,2,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"מלך הגת \",\"6332\",\"0547087799\",3,3,2,2,10,6,0,15,6,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בית קפה ג'ון\",\"6201\",\"548620446\",0,0,0,0,20,0,20,10,0,1,\"m66h4_TY&*fopkr\",1,0,0],[\"קיוסק ומשקאות מרטין\",\"6028\",\"546957971\",5,5,10,5,25,10,5,15,5,1,\"msgfr6_TY&*ghkjh\",3,0,0],[\"ג'חנון פון\",\"6110\",\"502759088\",5,0,5,0,2,2,2,2,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"נעשה ונצליח ע.פ יזמות עסקית בע\\\"מ - לב התקוה לקוח\",\"6234\",\"527743433\",3,3,0,0,0,10,0,0,5,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"אלכוהול שופ - לקוח\",\"6077\",\"546160675\",2,2,5,2,0,5,0,0,2,1,\"pewr1778256edrf\",1,0,0],[\"קליית התקווה\",\"6256\",\"522454084\",0,0,5,0,0,4,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"עידן ברק\",\"6298\",\"522682902\",0,0,0,0,0,0,0,5,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"נעשה ונצליח ע.פ יזמות עסקית בע\\\"מ-קופי נאו\",\"6235\",\"0547799671\",2,0,0,0,2,2,2,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"קסם משקאות\",\"6307\",\"505933420\",2,2,2,0,2,2,2,0,2,1,\"pewr1778256edrf\",1,0,0],[\"דני אדרי\",\"6292\",\"505214739\",2,0,0,0,0,0,3,0,0,1,\"msgfr6_TY&*ghkjh\",3,0,0],[\"קליית אסיף\",\"6258\",\"504909010\",2,2,5,0,0,2,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"ש.ב חנויות נוחות בע\\\"מ\",\"6026\",\"544860882\",5,0,5,0,0,5,2,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"יאנט אינג'רה\",\"6047\",\"536292765\",0,0,0,0,13,0,7,2,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"קניון בקיוסק\",\"6254\",\"503747989\",2,2,5,0,2,0,3,0,2,1,\"66jh6_TY&*gsejh\",1,0,0],[\"ל.י חנויות נוחות בע\\\"מ\",\"6043\",\"509518158\",0,0,3,0,20,5,5,0,2,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"גת ונרגילה אדם\",\"6284\",\"504698272\",0,0,5,0,10,2,5,0,2,1,\"m66h4_TY&*fopkr\",1,0,0],[\"תנובת השדה\",\"6025\",\"523640654\",0,0,0,0,6,0,0,1,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"המקום של שובי\",\"6053\",\"528388880\",5,5,10,0,0,5,0,0,5,1,\"66jh6_TY&*gsejh\",1,0,0],[\"קואוי עיצובים בע\\\"מ\",\"6030\",\"502844123\",0,0,0,0,2,2,2,0,2,1,\"msgfr6_TY&*ghkjh\",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{\"value\":\"גת XP\",\"label\":\"גת XP\"},{\"value\":\"גת XR\",\"label\":\"גת XR\"},{\"value\":\"גת SP מובחר\",\"label\":\"גת SP מובחר\"},{\"value\":\"גת SPXP\",\"label\":\"גת SPXP\"},{\"value\":\"קימבו גדול\",\"label\":\"קימבו גדול\"},{\"value\":\"הרנה 250 גרם\",\"label\":\"הרנה 250 גרם\"},{\"value\":\"אבו מיסמר גדול\",\"label\":\"אבו מיסמר גדול\"},{\"value\":\"אבו מיסמר קטן\",\"label\":\"אבו מיסמר קטן\"},{\"value\":\"קימבו קטן\",\"label\":\"קימבו קטן\"}],[[null,null,\"פריט\",\"XP100BG\",\"XR100BG\",\"SP250BG\",\"SX250BG\",\"KI\",\"KI\",\"HI\",\"AB\",\"AB\",null,null,null,null,null],[null,null,\"במלאי\",92,50,125,36,120,95,75,40,40,null,null,null,null,null],[null,null,\"בהזמנה\",69,44,91,9,185,99,72,64,50,null,null,null,null,null],[null,null,\"נותר\",23,6,34,27,-65,-4,3,-24,-10,null,null,null,null,null]]]","isBI":true,"isProduced":true,"isInitiated":true,"counter":0,"innerLog":[],"createdAt":"2022-12-28T19:00:02.355Z","updatedAt":"2022-12-29T08:46:27.516Z","__v":0},{"_id":"63ac92316ce5bee9e1f87201","Date":"2022-12-29T00:00:00.000Z","matrixID":"d628e42c7a366ad849f069c5b0f600b35eb727a78909ffae2155cc2e41270459","matrixName":"חמישי ","userID":"6358f8717dd95eceee53eac3","matrixesData":{"mainMatrix":{"matrixID":"d628e42c7a366ad849f069c5b0f600b35eb727a78909ffae2155cc2e41270459","ActionID":[1,1,1,1,1,1,1,1,1,1,1,1,1],"AccountKey":["6247","6107","6027","6051","6054","6104","6280","6293","6268","6323","6224","6326","6332"],"DocumentID":[1,1,1,1,1,1,1,1,1,1,1,1,1],"DriverID":["pewr1778256edrf","pewr1778256edrf","m66h4_TY&*fopkr","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","pewr1778256edrf","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh"],"ActionAutho":["Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default"],"itemsHeaders":["XP100SA","XR100SA","SP250SA","SX250SA","KI250SA","KI100SA","HI250SA","AB500SA","AB250SA"],"itemsNames":["גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן"],"cellsData":[[36,0,18,0,12,0,4,0,0],[4,4,7,0,1,1,0,0,0],[40,10,8,0,15,0,5,0,0],[20,5,5,5,0,0,0,0,0],[20,5,10,0,0,0,0,0,0],[5,0,5,0,10,0,0,0,0],[10,2,8,0,0,0,0,0,0],[25,0,0,0,0,0,0,0,0],[20,15,40,0,5,5,0,0,0],[6,2,0,0,3,2,0,0,0],[10,6,6,10,4,6,0,8,0],[3,3,3,0,0,0,0,0,0],[10,10,10,10,10,6,0,15,6]]},"changesMatrix":{"matrixConfig":null,"matrixGlobalData":null,"cellsData":[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],"docData":[null,null,null,null,null,null,null,null,null,null,null,null,null],"metaData":[null,null,null,null,null,null,null,null,null,null,null,null,null]}},"matrixesUiData":"[[[\"שם לקוח\",\"מזהה\",\"טלפון\",\"גת XP\",\"גת XR\",\"גת SP מובחר\",\"גת SPXP\",\"קימבו גדול\",\"קימבו קטן\",\"הרנה 250 גרם\",\"אבו מיסמר גדול\",\"אבו מיסמר קטן\",\"סוג מסמך\",\"איסוף\",\"מאושר\",\"מידע למסמך\",\"\"],[\"התימניה\",\"6247\",\"544421862\",36,0,18,0,12,0,4,0,0,1,\"pewr1778256edrf\",1,0,0],[\"בונבון משה שון צרפתי\",\"6107\",\"547397871\",4,4,7,0,1,1,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"רגע מתוק\",\"6027\",\"503303738\",40,10,8,0,15,0,5,0,0,1,\"m66h4_TY&*fopkr\",1,0,0],[\"הצומת של אריק\",\"6051\",\"522255577\",20,5,5,5,0,0,0,0,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"הבית של הגת\",\"6054\",\"528979242\",20,5,10,0,0,0,0,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בר ליאור\",\"6104\",\"549385483\",5,0,5,0,10,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"הפינה של דוד\",\"6280\",\"542285227\",10,2,8,0,0,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"שמעון ברהום\",\"6293\",\"527603255\",25,0,0,0,0,0,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"יואב\",\"6268\",\"527737771\",20,15,40,0,5,5,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"הפינה של כדורי\",\"6323\",\"505063692\",6,2,0,0,3,2,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"בן חיים פז וטל בע\\\"מ\",\"6224\",\"546766824\",10,6,6,10,4,6,0,8,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"אריה חתוכה\",\"6326\",\"0505282481\",3,3,3,0,0,0,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"מלך הגת \",\"6332\",\"0547087799\",10,10,10,10,10,6,0,15,6,1,\"msgfr6_TY&*ghkjh\",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{\"value\":\"גת XP\",\"label\":\"גת XP\"},{\"value\":\"גת XR\",\"label\":\"גת XR\"},{\"value\":\"גת SP מובחר\",\"label\":\"גת SP מובחר\"},{\"value\":\"גת SPXP\",\"label\":\"גת SPXP\"},{\"value\":\"קימבו גדול\",\"label\":\"קימבו גדול\"},{\"value\":\"הרנה 250 גרם\",\"label\":\"הרנה 250 גרם\"},{\"value\":\"אבו מיסמר גדול\",\"label\":\"אבו מיסמר גדול\"},{\"value\":\"אבו מיסמר קטן\",\"label\":\"אבו מיסמר קטן\"},{\"value\":\"קימבו קטן\",\"label\":\"קימבו קטן\"}],[[null,null,\"פריט\",\"XP100BG\",\"XR100BG\",\"SP250BG\",\"SX250BG\",\"KI\",\"KI\",\"HI\",\"AB\",\"AB\",null,null,null,null,null],[null,null,\"במלאי\",92,50,45,36,160,0,75,60,0,null,null,null,null,null],[null,null,\"בהזמנה\",209,62,120,25,60,20,9,23,6,null,null,null,null,null],[null,null,\"נותר\",-117,-12,-75,11,100,-20,66,37,-6,null,null,null,null,null]]]","isBI":true,"isProduced":false,"isInitiated":true,"counter":0,"innerLog":[],"createdAt":"2022-12-28T19:00:02.566Z","updatedAt":"2022-12-28T19:00:02.566Z","__v":0},{"_id":"63ad398357a128779af8f8ce","Date":"2022-12-29T00:00:00.000Z","matrixID":"e6fd08264ad19fb2bc854156ed4b5fc50f81b69781c53b15dd910f87e4d262e1","matrixName":"חמישי  דרום שרון מרכז 29/12","userID":"6358f8717dd95eceee53eac3","matrixesData":{"mainMatrix":{"matrixID":"e6fd08264ad19fb2bc854156ed4b5fc50f81b69781c53b15dd910f87e4d262e1","ActionID":[1,1,1,1,1,1,1,1,1,1,1,1,1],"AccountKey":["6247","6107","6027","6051","6054","6104","6280","6293","6268","6323","6224","6326","6332"],"DocumentID":[1,1,1,1,1,1,1,1,1,1,1,1,1],"DriverID":["pewr1778256edrf","pewr1778256edrf","m66h4_TY&*fopkr","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","pewr1778256edrf","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh"],"ActionAutho":["Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default"],"itemsHeaders":["XP100SA","XR100SA","SP250SA","SX250SA","KI250SA","KI100SA","HI250SA","AB500SA","AB250SA"],"itemsNames":["גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן"],"cellsData":[[36,0,18,0,12,0,4,0,0],[4,4,7,0,1,1,0,0,0],[40,10,8,0,15,0,5,0,0],[20,5,5,5,0,0,0,0,0],[20,5,10,0,0,0,0,0,0],[5,0,5,0,10,0,0,0,0],[10,2,8,0,0,0,0,0,0],[25,0,0,0,0,0,0,0,0],[20,15,40,0,5,5,0,0,0],[6,2,0,0,3,2,0,0,0],[10,6,6,10,4,6,0,8,0],[3,3,3,0,0,0,0,0,0],[10,10,10,10,10,6,0,15,6]]},"changesMatrix":{"matrixConfig":null,"matrixGlobalData":null,"cellsData":[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],"docData":[null,null,null,null,null,null,null,null,null,null,null,null,null],"metaData":[null,null,null,null,null,null,null,null,null,null,null,null,null]}},"matrixesUiData":"[[[\"שם לקוח\",\"מזהה\",\"טלפון\",\"גת XP\",\"גת XR\",\"גת SP מובחר\",\"גת SPXP\",\"קימבו גדול\",\"קימבו קטן\",\"הרנה 250 גרם\",\"אבו מיסמר גדול\",\"אבו מיסמר קטן\",\"סוג מסמך\",\"איסוף\",\"מאושר\",\"מידע למסמך\",\"\"],[\"התימניה\",\"6247\",\"544421862\",36,0,18,0,12,0,4,0,0,1,\"pewr1778256edrf\",1,0,0],[\"בונבון משה שון צרפתי\",\"6107\",\"547397871\",4,4,7,0,1,1,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"רגע מתוק\",\"6027\",\"503303738\",40,10,8,0,15,0,5,0,0,1,\"m66h4_TY&*fopkr\",1,0,0],[\"הצומת של אריק\",\"6051\",\"522255577\",20,5,5,5,0,0,0,0,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"הבית של הגת\",\"6054\",\"528979242\",20,5,10,0,0,0,0,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בר ליאור\",\"6104\",\"549385483\",5,0,5,0,10,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"הפינה של דוד\",\"6280\",\"542285227\",10,2,8,0,0,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"שמעון ברהום\",\"6293\",\"527603255\",25,0,0,0,0,0,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"יואב\",\"6268\",\"527737771\",20,15,40,0,5,5,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"הפינה של כדורי\",\"6323\",\"505063692\",6,2,0,0,3,2,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"בן חיים פז וטל בע\\\"מ\",\"6224\",\"546766824\",10,6,6,10,4,6,0,8,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"אריה חתוכה\",\"6326\",\"0505282481\",3,3,3,0,0,0,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"מלך הגת \",\"6332\",\"0547087799\",10,10,10,10,10,6,0,15,6,1,\"msgfr6_TY&*ghkjh\",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{\"value\":\"גת XP\",\"label\":\"גת XP\"},{\"value\":\"גת XR\",\"label\":\"גת XR\"},{\"value\":\"גת SP מובחר\",\"label\":\"גת SP מובחר\"},{\"value\":\"גת SPXP\",\"label\":\"גת SPXP\"},{\"value\":\"קימבו גדול\",\"label\":\"קימבו גדול\"},{\"value\":\"הרנה 250 גרם\",\"label\":\"הרנה 250 גרם\"},{\"value\":\"אבו מיסמר גדול\",\"label\":\"אבו מיסמר גדול\"},{\"value\":\"אבו מיסמר קטן\",\"label\":\"אבו מיסמר קטן\"},{\"value\":\"קימבו קטן\",\"label\":\"קימבו קטן\"}],[[null,null,\"פריט\",\"XP100BG\",\"XR100BG\",\"SP250BG\",\"SX250BG\",\"KI\",\"KI\",\"HI\",\"AB\",\"AB\",null,null,null,null,null],[null,null,\"במלאי\",92,50,45,36,160,0,75,60,0,null,null,null,null,null],[null,null,\"בהזמנה\",209,62,120,25,60,20,9,23,6,null,null,null,null,null],[null,null,\"נותר\",-117,-12,-75,11,100,-20,66,37,-6,null,null,null,null,null]]]","isBI":true,"isProduced":false,"isInitiated":true,"counter":0,"innerLog":[],"createdAt":"2022-12-29T06:53:57.558Z","updatedAt":"2022-12-29T06:53:57.558Z","__v":0},{"_id":"63ad6595067dc53336ab0ae5","Date":"2022-12-29T11:54:42.000Z","matrixID":"20228221502ebe267fc22a353dfd9570dacbafa193786ec81e5913469f8a4126","matrixName":"גבייה 29/12/22","userID":"6358f8717dd95eceee53eac3","matrixesData":{"mainMatrix":{"matrixID":"20228221502ebe267fc22a353dfd9570dacbafa193786ec81e5913469f8a4126","ActionID":[1,1,1,1,1,1,1,1,1,1,1,1,1],"AccountKey":["6247","6107","6027","6051","6054","6104","6280","6293","6268","6323","6224","6326","6332"],"DocumentID":[1,1,1,1,1,1,1,1,1,1,1,1,1],"DriverID":["pewr1778256edrf","pewr1778256edrf","m66h4_TY&*fopkr","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","pewr1778256edrf","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh"],"ActionAutho":["Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default"],"itemsHeaders":["XP100SA","XR100SA","SP250SA","SX250SA","KI250SA","KI100SA","HI250SA","AB500SA","AB250SA"],"itemsNames":["גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן"],"cellsData":[[36,0,18,0,12,0,4,0,0],[4,4,7,0,1,1,0,0,0],[40,10,8,0,15,0,5,0,0],[20,5,5,5,0,0,0,0,0],[20,5,10,0,0,0,0,0,0],[5,0,5,0,10,0,0,0,0],[10,2,8,0,0,0,0,0,0],[25,0,0,0,0,0,0,0,0],[20,15,40,0,5,5,0,0,0],[6,2,0,0,3,2,0,0,0],[10,6,6,10,4,6,0,8,0],[3,3,3,0,0,0,0,0,0],[10,10,10,10,10,6,0,15,6]]},"changesMatrix":{"matrixConfig":null,"matrixGlobalData":null,"cellsData":[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],"docData":[null,null,null,null,null,null,null,null,null,null,null,null,null],"metaData":[null,null,null,null,null,null,null,null,null,null,null,null,null]}},"matrixesUiData":"[[[\"שם לקוח\",\"מזהה\",\"טלפון\",\"גת XP\",\"גת XR\",\"גת SP מובחר\",\"גת SPXP\",\"קימבו גדול\",\"קימבו קטן\",\"הרנה 250 גרם\",\"אבו מיסמר גדול\",\"אבו מיסמר קטן\",\"סוג מסמך\",\"איסוף\",\"מאושר\",\"מידע למסמך\",\"\"],[\"התימניה\",\"6247\",\"544421862\",36,0,18,0,12,0,4,0,0,1,\"pewr1778256edrf\",1,0,0],[\"בונבון משה שון צרפתי\",\"6107\",\"547397871\",4,4,7,0,1,1,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"רגע מתוק\",\"6027\",\"503303738\",40,10,8,0,15,0,5,0,0,1,\"m66h4_TY&*fopkr\",1,0,0],[\"הצומת של אריק\",\"6051\",\"522255577\",20,5,5,5,0,0,0,0,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"הבית של הגת\",\"6054\",\"528979242\",20,5,10,0,0,0,0,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בר ליאור\",\"6104\",\"549385483\",5,0,5,0,10,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"הפינה של דוד\",\"6280\",\"542285227\",10,2,8,0,0,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"שמעון ברהום\",\"6293\",\"527603255\",25,0,0,0,0,0,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"יואב\",\"6268\",\"527737771\",20,15,40,0,5,5,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"הפינה של כדורי\",\"6323\",\"505063692\",6,2,0,0,3,2,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"בן חיים פז וטל בע\\\"מ\",\"6224\",\"546766824\",10,6,6,10,4,6,0,8,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"אריה חתוכה\",\"6326\",\"0505282481\",3,3,3,0,0,0,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"מלך הגת \",\"6332\",\"0547087799\",10,10,10,10,10,6,0,15,6,1,\"msgfr6_TY&*ghkjh\",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{\"value\":\"גת XP\",\"label\":\"גת XP\"},{\"value\":\"גת XR\",\"label\":\"גת XR\"},{\"value\":\"גת SP מובחר\",\"label\":\"גת SP מובחר\"},{\"value\":\"גת SPXP\",\"label\":\"גת SPXP\"},{\"value\":\"קימבו גדול\",\"label\":\"קימבו גדול\"},{\"value\":\"הרנה 250 גרם\",\"label\":\"הרנה 250 גרם\"},{\"value\":\"אבו מיסמר גדול\",\"label\":\"אבו מיסמר גדול\"},{\"value\":\"אבו מיסמר קטן\",\"label\":\"אבו מיסמר קטן\"},{\"value\":\"קימבו קטן\",\"label\":\"קימבו קטן\"}],[[null,null,\"פריט\",\"XP100BG\",\"XR100BG\",\"SP250BG\",\"SX250BG\",\"KI\",\"KI\",\"HI\",\"AB\",\"AB\",null,null,null,null,null],[null,null,\"במלאי\",92,50,45,36,160,0,75,60,0,null,null,null,null,null],[null,null,\"בהזמנה\",209,62,120,25,60,20,9,23,6,null,null,null,null,null],[null,null,\"נותר\",-117,-12,-75,11,100,-20,66,37,-6,null,null,null,null,null]]]","isBI":true,"isProduced":false,"isInitiated":false,"counter":0,"innerLog":[],"createdAt":"2022-12-29T10:01:58.116Z","updatedAt":"2022-12-29T10:01:58.116Z","__v":0},{"_id":"63ad6687067dc53336ab0c83","Date":"2022-12-29T13:54:42.000Z","matrixID":"fb627607afad15c727a9692e85af25d42d099ecf6caed19621fe2ecf99aded1b","matrixName":"בדיקה","userID":"6358f8717dd95eceee53eac3","matrixesData":{"mainMatrix":{"matrixID":"fb627607afad15c727a9692e85af25d42d099ecf6caed19621fe2ecf99aded1b","ActionID":[1,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1],"AccountKey":["6247","6107","6027","6051","6054","6104","6280","6268","6323","6224","6326","6332","6201","6028","6110","6234","6077","6256","6298","6235","6307","6292","6258","6026","6047","6254","6043","6284","6025","6053","6030"],"DocumentID":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],"DriverID":["pewr1778256edrf","pewr1778256edrf","m66h4_TY&*fopkr","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","pewr1778256edrf","lopd4_TY&*ghkjh","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh","m66h4_TY&*fopkr","msgfr6_TY&*ghkjh","66jh6_TY&*gsejh","lopd4_TY&*ghkjh","pewr1778256edrf","lopd4_TY&*ghkjh","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","pewr1778256edrf","msgfr6_TY&*ghkjh","lopd4_TY&*ghkjh","msgfr6_TY&*ghkjh","66jh6_TY&*gsejh","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh","m66h4_TY&*fopkr","msgfr6_TY&*ghkjh","66jh6_TY&*gsejh","msgfr6_TY&*ghkjh"],"ActionAutho":["Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default","Default"],"itemsHeaders":[null,null,null,null,null,null,null,null,null],"itemsNames":[null,null,null,null,null,null,null,null,null],"cellsData":[[5,0,5,0,15,0,2,4,0],[1,1,1,0,2,2,0,0,0],[5,2,2,0,20,2,5,0,2],[2,2,2,0,0,5,0,0,2],[5,2,2,0,0,5,0,0,5],[0,0,0,0,15,0,0,0,0],[2,2,0,0,2,2,2,0,2],[5,5,10,0,10,10,5,2,2],[2,2,0,0,3,3,0,0,2],[2,2,5,0,4,6,0,8,0],[2,2,2,0,0,2,0,0,2],[3,3,2,2,10,6,0,15,6],[0,0,0,0,20,0,20,10,0],[5,5,10,5,25,10,5,15,5],[5,0,5,0,2,2,2,2,0],[3,3,0,0,0,10,0,0,5],[2,2,5,2,0,5,0,0,2],[0,0,5,0,0,4,0,0,0],[0,0,0,0,0,0,0,5,0],[2,0,0,0,2,2,2,0,0],[2,2,2,0,2,2,2,0,2],[2,0,0,0,0,0,3,0,0],[2,2,5,0,0,2,0,0,0],[5,0,5,0,0,5,2,0,0],[0,0,0,0,13,0,7,2,0],[2,2,5,0,2,0,3,0,2],[0,0,3,0,20,5,5,0,2],[0,0,5,0,10,2,5,0,2],[0,0,0,0,6,0,0,1,0],[5,5,10,0,0,5,0,0,5],[0,0,0,0,2,2,2,0,2]]},"changesMatrix":{"matrixConfig":null,"matrixGlobalData":null,"cellsData":[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],"docData":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],"metaData":[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]}},"matrixesUiData":"[[[\"שם לקוח\",\"מזהה\",\"טלפון\",\"גת XP\",\"גת XR\",\"גת SP מובחר\",\"גת SPXP\",\"קימבו גדול\",\"קימבו קטן\",\"הרנה 250 גרם\",\"אבו מיסמר גדול\",\"אבו מיסמר קטן\",\"סוג מסמך\",\"איסוף\",\"מאושר\",\"מידע למסמך\",\"\"],[\"התימניה\",\"6247\",\"544421862\",5,0,5,0,15,0,2,4,0,1,\"pewr1778256edrf\",1,0,\"\"],[\"בונבון משה שון צרפתי\",\"6107\",\"547397871\",1,1,1,0,2,2,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"רגע מתוק\",\"6027\",\"503303738\",5,2,2,0,20,2,5,0,2,1,\"m66h4_TY&*fopkr\",1,0,0],[\"הצומת של אריק\",\"6051\",\"522255577\",2,2,2,0,0,5,0,0,2,1,\"66jh6_TY&*gsejh\",1,0,0],[\"הבית של הגת\",\"6054\",\"528979242\",5,2,2,0,0,5,0,0,5,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בר ליאור\",\"6104\",\"549385483\",0,0,0,0,15,0,0,0,0,1,\"pewr1778256edrf\",1,0,0],[\"הפינה של דוד\",\"6280\",\"542285227\",2,2,0,0,2,2,2,0,2,1,\"pewr1778256edrf\",1,0,0],[\"יואב\",\"6268\",\"527737771\",5,5,10,0,10,10,5,2,2,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"הפינה של כדורי\",\"6323\",\"505063692\",2,2,0,0,3,3,0,0,2,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"בן חיים פז וטל בע\\\"מ\",\"6224\",\"546766824\",2,2,5,0,4,6,0,8,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"אריה חתוכה\",\"6326\",\"0505282481\",2,2,2,0,0,2,0,0,2,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"מלך הגת \",\"6332\",\"0547087799\",3,3,2,2,10,6,0,15,6,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"בית קפה ג'ון\",\"6201\",\"548620446\",0,0,0,0,20,0,20,10,0,1,\"m66h4_TY&*fopkr\",1,0,0],[\"קיוסק ומשקאות מרטין\",\"6028\",\"546957971\",5,5,10,5,25,10,5,15,5,1,\"msgfr6_TY&*ghkjh\",3,0,0],[\"ג'חנון פון\",\"6110\",\"502759088\",5,0,5,0,2,2,2,2,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"נעשה ונצליח ע.פ יזמות עסקית בע\\\"מ - לב התקוה לקוח\",\"6234\",\"527743433\",3,3,0,0,0,10,0,0,5,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"אלכוהול שופ - לקוח\",\"6077\",\"546160675\",2,2,5,2,0,5,0,0,2,1,\"pewr1778256edrf\",1,0,0],[\"קליית התקווה\",\"6256\",\"522454084\",0,0,5,0,0,4,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"עידן ברק\",\"6298\",\"522682902\",0,0,0,0,0,0,0,5,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"נעשה ונצליח ע.פ יזמות עסקית בע\\\"מ-קופי נאו\",\"6235\",\"0547799671\",2,0,0,0,2,2,2,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"קסם משקאות\",\"6307\",\"505933420\",2,2,2,0,2,2,2,0,2,1,\"pewr1778256edrf\",1,0,0],[\"דני אדרי\",\"6292\",\"505214739\",2,0,0,0,0,0,3,0,0,1,\"msgfr6_TY&*ghkjh\",3,0,0],[\"קליית אסיף\",\"6258\",\"504909010\",2,2,5,0,0,2,0,0,0,1,\"lopd4_TY&*ghkjh\",1,0,0],[\"ש.ב חנויות נוחות בע\\\"מ\",\"6026\",\"544860882\",5,0,5,0,0,5,2,0,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"יאנט אינג'רה\",\"6047\",\"536292765\",0,0,0,0,13,0,7,2,0,1,\"66jh6_TY&*gsejh\",1,0,0],[\"קניון בקיוסק\",\"6254\",\"503747989\",2,2,5,0,2,0,3,0,2,1,\"66jh6_TY&*gsejh\",1,0,0],[\"ל.י חנויות נוחות בע\\\"מ\",\"6043\",\"509518158\",0,0,3,0,20,5,5,0,2,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"גת ונרגילה אדם\",\"6284\",\"504698272\",0,0,5,0,10,2,5,0,2,1,\"m66h4_TY&*fopkr\",1,0,0],[\"תנובת השדה\",\"6025\",\"523640654\",0,0,0,0,6,0,0,1,0,1,\"msgfr6_TY&*ghkjh\",1,0,0],[\"המקום של שובי\",\"6053\",\"528388880\",5,5,10,0,0,5,0,0,5,1,\"66jh6_TY&*gsejh\",1,0,0],[\"קואוי עיצובים בע\\\"מ\",\"6030\",\"502844123\",0,0,0,0,2,2,2,0,2,1,\"msgfr6_TY&*ghkjh\",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{\"value\":\"גת XP\",\"label\":\"גת XP\"},{\"value\":\"גת XR\",\"label\":\"גת XR\"},{\"value\":\"גת SP מובחר\",\"label\":\"גת SP מובחר\"},{\"value\":\"גת SPXP\",\"label\":\"גת SPXP\"},{\"value\":\"קימבו גדול\",\"label\":\"קימבו גדול\"},{\"value\":\"הרנה 250 גרם\",\"label\":\"הרנה 250 גרם\"},{\"value\":\"אבו מיסמר גדול\",\"label\":\"אבו מיסמר גדול\"},{\"value\":\"אבו מיסמר קטן\",\"label\":\"אבו מיסמר קטן\"},{\"value\":\"קימבו קטן\",\"label\":\"קימבו קטן\"}],[[null,null,\"פריט\",\"XP100BG\",\"XR100BG\",\"SP250BG\",\"SX250BG\",\"KI\",\"KI\",\"HI\",\"AB\",\"AB\",null,null,null,null,null],[null,null,\"במלאי\",92,50,125,36,120,95,75,40,40,null,null,null,null,null],[null,null,\"בהזמנה\",69,44,91,9,185,99,72,64,50,null,null,null,null,null],[null,null,\"נותר\",23,6,34,27,-65,-4,3,-24,-10,null,null,null,null,null]]]","isBI":false,"isProduced":false,"isInitiated":false,"counter":0,"innerLog":[],"createdAt":"2022-12-29T10:06:01.216Z","updatedAt":"2022-12-29T10:29:2
let t = {
  result: {
    status: "yes",
    data: [
      {
        _id: "63ac922f6ce5bee9e1f8710c",
        Date: "2022-12-29T00:00:00.000Z",
        matrixID: "4d6dc31e778cbdac37447475f9c3aca0182bf102c39bc9648d45826319b7331d",
        matrixName: "חמישי דרום שרון ומרכז 29/12",
        userID: "6358f8717dd95eceee53eac3",
        matrixesData: {
          mainMatrix: {
            matrixID: "4d6dc31e778cbdac37447475f9c3aca0182bf102c39bc9648d45826319b7331d",
            ActionID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            AccountKey: [
              "6247",
              "6107",
              "6027",
              "6051",
              "6054",
              "6104",
              "6280",
              "6268",
              "6323",
              "6224",
              "6326",
              "6332",
              "6201",
              "6028",
              "6110",
              "6234",
              "6077",
              "6256",
              "6298",
              "6235",
              "6307",
              "6292",
              "6258",
              "6026",
              "6047",
              "6254",
              "6043",
              "6284",
              "6025",
              "6053",
              "6030",
            ],
            DocumentID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            DriverID: [
              "pewr1778256edrf",
              "pewr1778256edrf",
              "m66h4_TY&*fopkr",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
              "m66h4_TY&*fopkr",
              "msgfr6_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "msgfr6_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "m66h4_TY&*fopkr",
              "msgfr6_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
            ],
            ActionAutho: [
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
            ],
            itemsHeaders: [
              "XP100SA",
              "XR100SA",
              "SP250SA",
              "SX250SA",
              "KI250SA",
              "KI100SA",
              "HI250SA",
              "AB500SA",
              "AB250SA",
            ],
            itemsNames: [
              "גת XP",
              "גת XR",
              "גת SP מובחר",
              "גת SPXP",
              "קימבו גדול",
              "קימבו קטן",
              "הרנה 250 גרם",
              "אבו מיסמר גדול",
              "אבו מיסמר קטן",
            ],
            cellsData: [
              [5, 0, 5, 0, 15, 0, 2, 4, 0],
              [1, 1, 1, 0, 2, 2, 0, 0, 0],
              [5, 2, 2, 0, 20, 2, 5, 0, 2],
              [2, 2, 2, 0, 0, 5, 0, 0, 2],
              [5, 2, 2, 0, 0, 5, 0, 0, 5],
              [0, 0, 0, 0, 15, 0, 0, 0, 0],
              [2, 2, 0, 0, 2, 2, 2, 0, 2],
              [5, 5, 10, 0, 10, 10, 5, 2, 2],
              [2, 2, 0, 0, 3, 3, 0, 0, 2],
              [2, 2, 5, 0, 4, 6, 0, 8, 0],
              [2, 2, 2, 0, 0, 2, 0, 0, 2],
              [3, 3, 2, 2, 10, 6, 0, 15, 6],
              [0, 0, 0, 0, 20, 0, 20, 10, 0],
              [5, 5, 10, 5, 25, 10, 5, 15, 5],
              [5, 0, 5, 0, 2, 2, 2, 2, 0],
              [3, 3, 0, 0, 0, 10, 0, 0, 5],
              [2, 2, 5, 2, 0, 5, 0, 0, 2],
              [0, 0, 5, 0, 0, 4, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 5, 0],
              [2, 0, 0, 0, 2, 2, 2, 0, 0],
              [2, 2, 2, 0, 2, 2, 2, 0, 2],
              [2, 0, 0, 0, 0, 0, 3, 0, 0],
              [2, 2, 5, 0, 0, 2, 0, 0, 0],
              [5, 0, 5, 0, 0, 5, 2, 0, 0],
              [0, 0, 0, 0, 13, 0, 7, 2, 0],
              [2, 2, 5, 0, 2, 0, 3, 0, 2],
              [0, 0, 3, 0, 20, 5, 5, 0, 2],
              [0, 0, 5, 0, 10, 2, 5, 0, 2],
              [0, 0, 0, 0, 6, 0, 0, 1, 0],
              [5, 5, 10, 0, 0, 5, 0, 0, 5],
              [0, 0, 0, 0, 2, 2, 2, 0, 2],
            ],
          },
          changesMatrix: {
            matrixConfig: null,
            matrixGlobalData: null,
            cellsData: [
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
            ],
            docData: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            metaData: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
          },
        },
        matrixesUiData:
          '[[["שם לקוח","מזהה","טלפון","גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן","סוג מסמך","איסוף","מאושר","מידע למסמך",""],["התימניה","6247","544421862",5,0,5,0,15,0,2,4,0,1,"pewr1778256edrf",1,0,0],["בונבון משה שון צרפתי","6107","547397871",1,1,1,0,2,2,0,0,0,1,"pewr1778256edrf",1,0,0],["רגע מתוק","6027","503303738",5,2,2,0,20,2,5,0,2,1,"m66h4_TY&*fopkr",1,0,0],["הצומת של אריק","6051","522255577",2,2,2,0,0,5,0,0,2,1,"66jh6_TY&*gsejh",1,0,0],["הבית של הגת","6054","528979242",5,2,2,0,0,5,0,0,5,1,"msgfr6_TY&*ghkjh",1,0,0],["בר ליאור","6104","549385483",0,0,0,0,15,0,0,0,0,1,"pewr1778256edrf",1,0,0],["הפינה של דוד","6280","542285227",2,2,0,0,2,2,2,0,2,1,"pewr1778256edrf",1,0,0],["יואב","6268","527737771",5,5,10,0,10,10,5,2,2,1,"lopd4_TY&*ghkjh",1,0,0],["הפינה של כדורי","6323","505063692",2,2,0,0,3,3,0,0,2,1,"lopd4_TY&*ghkjh",1,0,0],["בן חיים פז וטל בע\\"מ","6224","546766824",2,2,5,0,4,6,0,8,0,1,"66jh6_TY&*gsejh",1,0,0],["אריה חתוכה","6326","0505282481",2,2,2,0,0,2,0,0,2,1,"lopd4_TY&*ghkjh",1,0,0],["מלך הגת ","6332","0547087799",3,3,2,2,10,6,0,15,6,1,"msgfr6_TY&*ghkjh",1,0,0],["בית קפה ג\'ון","6201","548620446",0,0,0,0,20,0,20,10,0,1,"m66h4_TY&*fopkr",1,0,0],["קיוסק ומשקאות מרטין","6028","546957971",5,5,10,5,25,10,5,15,5,1,"msgfr6_TY&*ghkjh",3,0,0],["ג\'חנון פון","6110","502759088",5,0,5,0,2,2,2,2,0,1,"66jh6_TY&*gsejh",1,0,0],["נעשה ונצליח ע.פ יזמות עסקית בע\\"מ - לב התקוה לקוח","6234","527743433",3,3,0,0,0,10,0,0,5,1,"lopd4_TY&*ghkjh",1,0,0],["אלכוהול שופ - לקוח","6077","546160675",2,2,5,2,0,5,0,0,2,1,"pewr1778256edrf",1,0,0],["קליית התקווה","6256","522454084",0,0,5,0,0,4,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["עידן ברק","6298","522682902",0,0,0,0,0,0,0,5,0,1,"66jh6_TY&*gsejh",1,0,0],["נעשה ונצליח ע.פ יזמות עסקית בע\\"מ-קופי נאו","6235","0547799671",2,0,0,0,2,2,2,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["קסם משקאות","6307","505933420",2,2,2,0,2,2,2,0,2,1,"pewr1778256edrf",1,0,0],["דני אדרי","6292","505214739",2,0,0,0,0,0,3,0,0,1,"msgfr6_TY&*ghkjh",3,0,0],["קליית אסיף","6258","504909010",2,2,5,0,0,2,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["ש.ב חנויות נוחות בע\\"מ","6026","544860882",5,0,5,0,0,5,2,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["יאנט אינג\'רה","6047","536292765",0,0,0,0,13,0,7,2,0,1,"66jh6_TY&*gsejh",1,0,0],["קניון בקיוסק","6254","503747989",2,2,5,0,2,0,3,0,2,1,"66jh6_TY&*gsejh",1,0,0],["ל.י חנויות נוחות בע\\"מ","6043","509518158",0,0,3,0,20,5,5,0,2,1,"msgfr6_TY&*ghkjh",1,0,0],["גת ונרגילה אדם","6284","504698272",0,0,5,0,10,2,5,0,2,1,"m66h4_TY&*fopkr",1,0,0],["תנובת השדה","6025","523640654",0,0,0,0,6,0,0,1,0,1,"msgfr6_TY&*ghkjh",1,0,0],["המקום של שובי","6053","528388880",5,5,10,0,0,5,0,0,5,1,"66jh6_TY&*gsejh",1,0,0],["קואוי עיצובים בע\\"מ","6030","502844123",0,0,0,0,2,2,2,0,2,1,"msgfr6_TY&*ghkjh",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{"value":"גת XP","label":"גת XP"},{"value":"גת XR","label":"גת XR"},{"value":"גת SP מובחר","label":"גת SP מובחר"},{"value":"גת SPXP","label":"גת SPXP"},{"value":"קימבו גדול","label":"קימבו גדול"},{"value":"הרנה 250 גרם","label":"הרנה 250 גרם"},{"value":"אבו מיסמר גדול","label":"אבו מיסמר גדול"},{"value":"אבו מיסמר קטן","label":"אבו מיסמר קטן"},{"value":"קימבו קטן","label":"קימבו קטן"}],[[null,null,"פריט","XP100BG","XR100BG","SP250BG","SX250BG","KI","KI","HI","AB","AB",null,null,null,null,null],[null,null,"במלאי",92,50,125,36,120,95,75,40,40,null,null,null,null,null],[null,null,"בהזמנה",69,44,91,9,185,99,72,64,50,null,null,null,null,null],[null,null,"נותר",23,6,34,27,-65,-4,3,-24,-10,null,null,null,null,null]]]',
        isBI: true,
        isProduced: true,
        isInitiated: true,
        counter: 0,
        innerLog: [],
        createdAt: "2022-12-28T19:00:02.355Z",
        updatedAt: "2022-12-29T08:46:27.516Z",
        __v: 0,
      },
      {
        _id: "63ac92316ce5bee9e1f87201",
        Date: "2022-12-29T00:00:00.000Z",
        matrixID: "d628e42c7a366ad849f069c5b0f600b35eb727a78909ffae2155cc2e41270459",
        matrixName: "חמישי ",
        userID: "6358f8717dd95eceee53eac3",
        matrixesData: {
          mainMatrix: {
            matrixID: "d628e42c7a366ad849f069c5b0f600b35eb727a78909ffae2155cc2e41270459",
            ActionID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            AccountKey: [
              "6247",
              "6107",
              "6027",
              "6051",
              "6054",
              "6104",
              "6280",
              "6293",
              "6268",
              "6323",
              "6224",
              "6326",
              "6332",
            ],
            DocumentID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            DriverID: [
              "pewr1778256edrf",
              "pewr1778256edrf",
              "m66h4_TY&*fopkr",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
            ],
            ActionAutho: [
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
            ],
            itemsHeaders: [
              "XP100SA",
              "XR100SA",
              "SP250SA",
              "SX250SA",
              "KI250SA",
              "KI100SA",
              "HI250SA",
              "AB500SA",
              "AB250SA",
            ],
            itemsNames: [
              "גת XP",
              "גת XR",
              "גת SP מובחר",
              "גת SPXP",
              "קימבו גדול",
              "קימבו קטן",
              "הרנה 250 גרם",
              "אבו מיסמר גדול",
              "אבו מיסמר קטן",
            ],
            cellsData: [
              [36, 0, 18, 0, 12, 0, 4, 0, 0],
              [4, 4, 7, 0, 1, 1, 0, 0, 0],
              [40, 10, 8, 0, 15, 0, 5, 0, 0],
              [20, 5, 5, 5, 0, 0, 0, 0, 0],
              [20, 5, 10, 0, 0, 0, 0, 0, 0],
              [5, 0, 5, 0, 10, 0, 0, 0, 0],
              [10, 2, 8, 0, 0, 0, 0, 0, 0],
              [25, 0, 0, 0, 0, 0, 0, 0, 0],
              [20, 15, 40, 0, 5, 5, 0, 0, 0],
              [6, 2, 0, 0, 3, 2, 0, 0, 0],
              [10, 6, 6, 10, 4, 6, 0, 8, 0],
              [3, 3, 3, 0, 0, 0, 0, 0, 0],
              [10, 10, 10, 10, 10, 6, 0, 15, 6],
            ],
          },
          changesMatrix: {
            matrixConfig: null,
            matrixGlobalData: null,
            cellsData: [
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
            ],
            docData: [null, null, null, null, null, null, null, null, null, null, null, null, null],
            metaData: [null, null, null, null, null, null, null, null, null, null, null, null, null],
          },
        },
        matrixesUiData:
          '[[["שם לקוח","מזהה","טלפון","גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן","סוג מסמך","איסוף","מאושר","מידע למסמך",""],["התימניה","6247","544421862",36,0,18,0,12,0,4,0,0,1,"pewr1778256edrf",1,0,0],["בונבון משה שון צרפתי","6107","547397871",4,4,7,0,1,1,0,0,0,1,"pewr1778256edrf",1,0,0],["רגע מתוק","6027","503303738",40,10,8,0,15,0,5,0,0,1,"m66h4_TY&*fopkr",1,0,0],["הצומת של אריק","6051","522255577",20,5,5,5,0,0,0,0,0,1,"66jh6_TY&*gsejh",1,0,0],["הבית של הגת","6054","528979242",20,5,10,0,0,0,0,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["בר ליאור","6104","549385483",5,0,5,0,10,0,0,0,0,1,"pewr1778256edrf",1,0,0],["הפינה של דוד","6280","542285227",10,2,8,0,0,0,0,0,0,1,"pewr1778256edrf",1,0,0],["שמעון ברהום","6293","527603255",25,0,0,0,0,0,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["יואב","6268","527737771",20,15,40,0,5,5,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["הפינה של כדורי","6323","505063692",6,2,0,0,3,2,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["בן חיים פז וטל בע\\"מ","6224","546766824",10,6,6,10,4,6,0,8,0,1,"66jh6_TY&*gsejh",1,0,0],["אריה חתוכה","6326","0505282481",3,3,3,0,0,0,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["מלך הגת ","6332","0547087799",10,10,10,10,10,6,0,15,6,1,"msgfr6_TY&*ghkjh",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{"value":"גת XP","label":"גת XP"},{"value":"גת XR","label":"גת XR"},{"value":"גת SP מובחר","label":"גת SP מובחר"},{"value":"גת SPXP","label":"גת SPXP"},{"value":"קימבו גדול","label":"קימבו גדול"},{"value":"הרנה 250 גרם","label":"הרנה 250 גרם"},{"value":"אבו מיסמר גדול","label":"אבו מיסמר גדול"},{"value":"אבו מיסמר קטן","label":"אבו מיסמר קטן"},{"value":"קימבו קטן","label":"קימבו קטן"}],[[null,null,"פריט","XP100BG","XR100BG","SP250BG","SX250BG","KI","KI","HI","AB","AB",null,null,null,null,null],[null,null,"במלאי",92,50,45,36,160,0,75,60,0,null,null,null,null,null],[null,null,"בהזמנה",209,62,120,25,60,20,9,23,6,null,null,null,null,null],[null,null,"נותר",-117,-12,-75,11,100,-20,66,37,-6,null,null,null,null,null]]]',
        isBI: true,
        isProduced: false,
        isInitiated: true,
        counter: 0,
        innerLog: [],
        createdAt: "2022-12-28T19:00:02.566Z",
        updatedAt: "2022-12-28T19:00:02.566Z",
        __v: 0,
      },
      {
        _id: "63ad398357a128779af8f8ce",
        Date: "2022-12-29T00:00:00.000Z",
        matrixID: "e6fd08264ad19fb2bc854156ed4b5fc50f81b69781c53b15dd910f87e4d262e1",
        matrixName: "חמישי  דרום שרון מרכז 29/12",
        userID: "6358f8717dd95eceee53eac3",
        matrixesData: {
          mainMatrix: {
            matrixID: "e6fd08264ad19fb2bc854156ed4b5fc50f81b69781c53b15dd910f87e4d262e1",
            ActionID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            AccountKey: [
              "6247",
              "6107",
              "6027",
              "6051",
              "6054",
              "6104",
              "6280",
              "6293",
              "6268",
              "6323",
              "6224",
              "6326",
              "6332",
            ],
            DocumentID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            DriverID: [
              "pewr1778256edrf",
              "pewr1778256edrf",
              "m66h4_TY&*fopkr",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
            ],
            ActionAutho: [
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
            ],
            itemsHeaders: [
              "XP100SA",
              "XR100SA",
              "SP250SA",
              "SX250SA",
              "KI250SA",
              "KI100SA",
              "HI250SA",
              "AB500SA",
              "AB250SA",
            ],
            itemsNames: [
              "גת XP",
              "גת XR",
              "גת SP מובחר",
              "גת SPXP",
              "קימבו גדול",
              "קימבו קטן",
              "הרנה 250 גרם",
              "אבו מיסמר גדול",
              "אבו מיסמר קטן",
            ],
            cellsData: [
              [36, 0, 18, 0, 12, 0, 4, 0, 0],
              [4, 4, 7, 0, 1, 1, 0, 0, 0],
              [40, 10, 8, 0, 15, 0, 5, 0, 0],
              [20, 5, 5, 5, 0, 0, 0, 0, 0],
              [20, 5, 10, 0, 0, 0, 0, 0, 0],
              [5, 0, 5, 0, 10, 0, 0, 0, 0],
              [10, 2, 8, 0, 0, 0, 0, 0, 0],
              [25, 0, 0, 0, 0, 0, 0, 0, 0],
              [20, 15, 40, 0, 5, 5, 0, 0, 0],
              [6, 2, 0, 0, 3, 2, 0, 0, 0],
              [10, 6, 6, 10, 4, 6, 0, 8, 0],
              [3, 3, 3, 0, 0, 0, 0, 0, 0],
              [10, 10, 10, 10, 10, 6, 0, 15, 6],
            ],
          },
          changesMatrix: {
            matrixConfig: null,
            matrixGlobalData: null,
            cellsData: [
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
            ],
            docData: [null, null, null, null, null, null, null, null, null, null, null, null, null],
            metaData: [null, null, null, null, null, null, null, null, null, null, null, null, null],
          },
        },
        matrixesUiData:
          '[[["שם לקוח","מזהה","טלפון","גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן","סוג מסמך","איסוף","מאושר","מידע למסמך",""],["התימניה","6247","544421862",36,0,18,0,12,0,4,0,0,1,"pewr1778256edrf",1,0,0],["בונבון משה שון צרפתי","6107","547397871",4,4,7,0,1,1,0,0,0,1,"pewr1778256edrf",1,0,0],["רגע מתוק","6027","503303738",40,10,8,0,15,0,5,0,0,1,"m66h4_TY&*fopkr",1,0,0],["הצומת של אריק","6051","522255577",20,5,5,5,0,0,0,0,0,1,"66jh6_TY&*gsejh",1,0,0],["הבית של הגת","6054","528979242",20,5,10,0,0,0,0,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["בר ליאור","6104","549385483",5,0,5,0,10,0,0,0,0,1,"pewr1778256edrf",1,0,0],["הפינה של דוד","6280","542285227",10,2,8,0,0,0,0,0,0,1,"pewr1778256edrf",1,0,0],["שמעון ברהום","6293","527603255",25,0,0,0,0,0,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["יואב","6268","527737771",20,15,40,0,5,5,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["הפינה של כדורי","6323","505063692",6,2,0,0,3,2,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["בן חיים פז וטל בע\\"מ","6224","546766824",10,6,6,10,4,6,0,8,0,1,"66jh6_TY&*gsejh",1,0,0],["אריה חתוכה","6326","0505282481",3,3,3,0,0,0,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["מלך הגת ","6332","0547087799",10,10,10,10,10,6,0,15,6,1,"msgfr6_TY&*ghkjh",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{"value":"גת XP","label":"גת XP"},{"value":"גת XR","label":"גת XR"},{"value":"גת SP מובחר","label":"גת SP מובחר"},{"value":"גת SPXP","label":"גת SPXP"},{"value":"קימבו גדול","label":"קימבו גדול"},{"value":"הרנה 250 גרם","label":"הרנה 250 גרם"},{"value":"אבו מיסמר גדול","label":"אבו מיסמר גדול"},{"value":"אבו מיסמר קטן","label":"אבו מיסמר קטן"},{"value":"קימבו קטן","label":"קימבו קטן"}],[[null,null,"פריט","XP100BG","XR100BG","SP250BG","SX250BG","KI","KI","HI","AB","AB",null,null,null,null,null],[null,null,"במלאי",92,50,45,36,160,0,75,60,0,null,null,null,null,null],[null,null,"בהזמנה",209,62,120,25,60,20,9,23,6,null,null,null,null,null],[null,null,"נותר",-117,-12,-75,11,100,-20,66,37,-6,null,null,null,null,null]]]',
        isBI: true,
        isProduced: false,
        isInitiated: true,
        counter: 0,
        innerLog: [],
        createdAt: "2022-12-29T06:53:57.558Z",
        updatedAt: "2022-12-29T06:53:57.558Z",
        __v: 0,
      },
      {
        _id: "63ad6595067dc53336ab0ae5",
        Date: "2022-12-29T11:54:42.000Z",
        matrixID: "20228221502ebe267fc22a353dfd9570dacbafa193786ec81e5913469f8a4126",
        matrixName: "גבייה 29/12/22",
        userID: "6358f8717dd95eceee53eac3",
        matrixesData: {
          mainMatrix: {
            matrixID: "20228221502ebe267fc22a353dfd9570dacbafa193786ec81e5913469f8a4126",
            ActionID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            AccountKey: [
              "6247",
              "6107",
              "6027",
              "6051",
              "6054",
              "6104",
              "6280",
              "6293",
              "6268",
              "6323",
              "6224",
              "6326",
              "6332",
            ],
            DocumentID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            DriverID: [
              "pewr1778256edrf",
              "pewr1778256edrf",
              "m66h4_TY&*fopkr",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
            ],
            ActionAutho: [
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
            ],
            itemsHeaders: [
              "XP100SA",
              "XR100SA",
              "SP250SA",
              "SX250SA",
              "KI250SA",
              "KI100SA",
              "HI250SA",
              "AB500SA",
              "AB250SA",
            ],
            itemsNames: [
              "גת XP",
              "גת XR",
              "גת SP מובחר",
              "גת SPXP",
              "קימבו גדול",
              "קימבו קטן",
              "הרנה 250 גרם",
              "אבו מיסמר גדול",
              "אבו מיסמר קטן",
            ],
            cellsData: [
              [36, 0, 18, 0, 12, 0, 4, 0, 0],
              [4, 4, 7, 0, 1, 1, 0, 0, 0],
              [40, 10, 8, 0, 15, 0, 5, 0, 0],
              [20, 5, 5, 5, 0, 0, 0, 0, 0],
              [20, 5, 10, 0, 0, 0, 0, 0, 0],
              [5, 0, 5, 0, 10, 0, 0, 0, 0],
              [10, 2, 8, 0, 0, 0, 0, 0, 0],
              [25, 0, 0, 0, 0, 0, 0, 0, 0],
              [20, 15, 40, 0, 5, 5, 0, 0, 0],
              [6, 2, 0, 0, 3, 2, 0, 0, 0],
              [10, 6, 6, 10, 4, 6, 0, 8, 0],
              [3, 3, 3, 0, 0, 0, 0, 0, 0],
              [10, 10, 10, 10, 10, 6, 0, 15, 6],
            ],
          },
          changesMatrix: {
            matrixConfig: null,
            matrixGlobalData: null,
            cellsData: [
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
            ],
            docData: [null, null, null, null, null, null, null, null, null, null, null, null, null],
            metaData: [null, null, null, null, null, null, null, null, null, null, null, null, null],
          },
        },
        matrixesUiData:
          '[[["שם לקוח","מזהה","טלפון","גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן","סוג מסמך","איסוף","מאושר","מידע למסמך",""],["התימניה","6247","544421862",36,0,18,0,12,0,4,0,0,1,"pewr1778256edrf",1,0,0],["בונבון משה שון צרפתי","6107","547397871",4,4,7,0,1,1,0,0,0,1,"pewr1778256edrf",1,0,0],["רגע מתוק","6027","503303738",40,10,8,0,15,0,5,0,0,1,"m66h4_TY&*fopkr",1,0,0],["הצומת של אריק","6051","522255577",20,5,5,5,0,0,0,0,0,1,"66jh6_TY&*gsejh",1,0,0],["הבית של הגת","6054","528979242",20,5,10,0,0,0,0,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["בר ליאור","6104","549385483",5,0,5,0,10,0,0,0,0,1,"pewr1778256edrf",1,0,0],["הפינה של דוד","6280","542285227",10,2,8,0,0,0,0,0,0,1,"pewr1778256edrf",1,0,0],["שמעון ברהום","6293","527603255",25,0,0,0,0,0,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["יואב","6268","527737771",20,15,40,0,5,5,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["הפינה של כדורי","6323","505063692",6,2,0,0,3,2,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["בן חיים פז וטל בע\\"מ","6224","546766824",10,6,6,10,4,6,0,8,0,1,"66jh6_TY&*gsejh",1,0,0],["אריה חתוכה","6326","0505282481",3,3,3,0,0,0,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["מלך הגת ","6332","0547087799",10,10,10,10,10,6,0,15,6,1,"msgfr6_TY&*ghkjh",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{"value":"גת XP","label":"גת XP"},{"value":"גת XR","label":"גת XR"},{"value":"גת SP מובחר","label":"גת SP מובחר"},{"value":"גת SPXP","label":"גת SPXP"},{"value":"קימבו גדול","label":"קימבו גדול"},{"value":"הרנה 250 גרם","label":"הרנה 250 גרם"},{"value":"אבו מיסמר גדול","label":"אבו מיסמר גדול"},{"value":"אבו מיסמר קטן","label":"אבו מיסמר קטן"},{"value":"קימבו קטן","label":"קימבו קטן"}],[[null,null,"פריט","XP100BG","XR100BG","SP250BG","SX250BG","KI","KI","HI","AB","AB",null,null,null,null,null],[null,null,"במלאי",92,50,45,36,160,0,75,60,0,null,null,null,null,null],[null,null,"בהזמנה",209,62,120,25,60,20,9,23,6,null,null,null,null,null],[null,null,"נותר",-117,-12,-75,11,100,-20,66,37,-6,null,null,null,null,null]]]',
        isBI: true,
        isProduced: false,
        isInitiated: false,
        counter: 0,
        innerLog: [],
        createdAt: "2022-12-29T10:01:58.116Z",
        updatedAt: "2022-12-29T10:01:58.116Z",
        __v: 0,
      },
      {
        _id: "63ad6687067dc53336ab0c83",
        Date: "2022-12-29T13:54:42.000Z",
        matrixID: "fb627607afad15c727a9692e85af25d42d099ecf6caed19621fe2ecf99aded1b",
        matrixName: "בדיקה",
        userID: "6358f8717dd95eceee53eac3",
        matrixesData: {
          mainMatrix: {
            matrixID: "fb627607afad15c727a9692e85af25d42d099ecf6caed19621fe2ecf99aded1b",
            ActionID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            AccountKey: [
              "6247",
              "6107",
              "6027",
              "6051",
              "6054",
              "6104",
              "6280",
              "6268",
              "6323",
              "6224",
              "6326",
              "6332",
              "6201",
              "6028",
              "6110",
              "6234",
              "6077",
              "6256",
              "6298",
              "6235",
              "6307",
              "6292",
              "6258",
              "6026",
              "6047",
              "6254",
              "6043",
              "6284",
              "6025",
              "6053",
              "6030",
            ],
            DocumentID: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            DriverID: [
              "pewr1778256edrf",
              "pewr1778256edrf",
              "m66h4_TY&*fopkr",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
              "m66h4_TY&*fopkr",
              "msgfr6_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "lopd4_TY&*ghkjh",
              "pewr1778256edrf",
              "lopd4_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "pewr1778256edrf",
              "msgfr6_TY&*ghkjh",
              "lopd4_TY&*ghkjh",
              "msgfr6_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
              "m66h4_TY&*fopkr",
              "msgfr6_TY&*ghkjh",
              "66jh6_TY&*gsejh",
              "msgfr6_TY&*ghkjh",
            ],
            ActionAutho: [
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
              "Default",
            ],
            itemsHeaders: [null, null, null, null, null, null, null, null, null],
            itemsNames: [null, null, null, null, null, null, null, null, null],
            cellsData: [
              [5, 0, 5, 0, 15, 0, 2, 4, 0],
              [1, 1, 1, 0, 2, 2, 0, 0, 0],
              [5, 2, 2, 0, 20, 2, 5, 0, 2],
              [2, 2, 2, 0, 0, 5, 0, 0, 2],
              [5, 2, 2, 0, 0, 5, 0, 0, 5],
              [0, 0, 0, 0, 15, 0, 0, 0, 0],
              [2, 2, 0, 0, 2, 2, 2, 0, 2],
              [5, 5, 10, 0, 10, 10, 5, 2, 2],
              [2, 2, 0, 0, 3, 3, 0, 0, 2],
              [2, 2, 5, 0, 4, 6, 0, 8, 0],
              [2, 2, 2, 0, 0, 2, 0, 0, 2],
              [3, 3, 2, 2, 10, 6, 0, 15, 6],
              [0, 0, 0, 0, 20, 0, 20, 10, 0],
              [5, 5, 10, 5, 25, 10, 5, 15, 5],
              [5, 0, 5, 0, 2, 2, 2, 2, 0],
              [3, 3, 0, 0, 0, 10, 0, 0, 5],
              [2, 2, 5, 2, 0, 5, 0, 0, 2],
              [0, 0, 5, 0, 0, 4, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0, 5, 0],
              [2, 0, 0, 0, 2, 2, 2, 0, 0],
              [2, 2, 2, 0, 2, 2, 2, 0, 2],
              [2, 0, 0, 0, 0, 0, 3, 0, 0],
              [2, 2, 5, 0, 0, 2, 0, 0, 0],
              [5, 0, 5, 0, 0, 5, 2, 0, 0],
              [0, 0, 0, 0, 13, 0, 7, 2, 0],
              [2, 2, 5, 0, 2, 0, 3, 0, 2],
              [0, 0, 3, 0, 20, 5, 5, 0, 2],
              [0, 0, 5, 0, 10, 2, 5, 0, 2],
              [0, 0, 0, 0, 6, 0, 0, 1, 0],
              [5, 5, 10, 0, 0, 5, 0, 0, 5],
              [0, 0, 0, 0, 2, 2, 2, 0, 2],
            ],
          },
          changesMatrix: {
            matrixConfig: null,
            matrixGlobalData: null,
            cellsData: [
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
              [null, null, null, null, null, null, null, null, null],
            ],
            docData: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
            metaData: [
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
            ],
          },
        },
        matrixesUiData:
          '[[["שם לקוח","מזהה","טלפון","גת XP","גת XR","גת SP מובחר","גת SPXP","קימבו גדול","קימבו קטן","הרנה 250 גרם","אבו מיסמר גדול","אבו מיסמר קטן","סוג מסמך","איסוף","מאושר","מידע למסמך",""],["התימניה","6247","544421862",5,0,5,0,15,0,2,4,0,1,"pewr1778256edrf",1,0,""],["בונבון משה שון צרפתי","6107","547397871",1,1,1,0,2,2,0,0,0,1,"pewr1778256edrf",1,0,0],["רגע מתוק","6027","503303738",5,2,2,0,20,2,5,0,2,1,"m66h4_TY&*fopkr",1,0,0],["הצומת של אריק","6051","522255577",2,2,2,0,0,5,0,0,2,1,"66jh6_TY&*gsejh",1,0,0],["הבית של הגת","6054","528979242",5,2,2,0,0,5,0,0,5,1,"msgfr6_TY&*ghkjh",1,0,0],["בר ליאור","6104","549385483",0,0,0,0,15,0,0,0,0,1,"pewr1778256edrf",1,0,0],["הפינה של דוד","6280","542285227",2,2,0,0,2,2,2,0,2,1,"pewr1778256edrf",1,0,0],["יואב","6268","527737771",5,5,10,0,10,10,5,2,2,1,"lopd4_TY&*ghkjh",1,0,0],["הפינה של כדורי","6323","505063692",2,2,0,0,3,3,0,0,2,1,"lopd4_TY&*ghkjh",1,0,0],["בן חיים פז וטל בע\\"מ","6224","546766824",2,2,5,0,4,6,0,8,0,1,"66jh6_TY&*gsejh",1,0,0],["אריה חתוכה","6326","0505282481",2,2,2,0,0,2,0,0,2,1,"lopd4_TY&*ghkjh",1,0,0],["מלך הגת ","6332","0547087799",3,3,2,2,10,6,0,15,6,1,"msgfr6_TY&*ghkjh",1,0,0],["בית קפה ג\'ון","6201","548620446",0,0,0,0,20,0,20,10,0,1,"m66h4_TY&*fopkr",1,0,0],["קיוסק ומשקאות מרטין","6028","546957971",5,5,10,5,25,10,5,15,5,1,"msgfr6_TY&*ghkjh",3,0,0],["ג\'חנון פון","6110","502759088",5,0,5,0,2,2,2,2,0,1,"66jh6_TY&*gsejh",1,0,0],["נעשה ונצליח ע.פ יזמות עסקית בע\\"מ - לב התקוה לקוח","6234","527743433",3,3,0,0,0,10,0,0,5,1,"lopd4_TY&*ghkjh",1,0,0],["אלכוהול שופ - לקוח","6077","546160675",2,2,5,2,0,5,0,0,2,1,"pewr1778256edrf",1,0,0],["קליית התקווה","6256","522454084",0,0,5,0,0,4,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["עידן ברק","6298","522682902",0,0,0,0,0,0,0,5,0,1,"66jh6_TY&*gsejh",1,0,0],["נעשה ונצליח ע.פ יזמות עסקית בע\\"מ-קופי נאו","6235","0547799671",2,0,0,0,2,2,2,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["קסם משקאות","6307","505933420",2,2,2,0,2,2,2,0,2,1,"pewr1778256edrf",1,0,0],["דני אדרי","6292","505214739",2,0,0,0,0,0,3,0,0,1,"msgfr6_TY&*ghkjh",3,0,0],["קליית אסיף","6258","504909010",2,2,5,0,0,2,0,0,0,1,"lopd4_TY&*ghkjh",1,0,0],["ש.ב חנויות נוחות בע\\"מ","6026","544860882",5,0,5,0,0,5,2,0,0,1,"msgfr6_TY&*ghkjh",1,0,0],["יאנט אינג\'רה","6047","536292765",0,0,0,0,13,0,7,2,0,1,"66jh6_TY&*gsejh",1,0,0],["קניון בקיוסק","6254","503747989",2,2,5,0,2,0,3,0,2,1,"66jh6_TY&*gsejh",1,0,0],["ל.י חנויות נוחות בע\\"מ","6043","509518158",0,0,3,0,20,5,5,0,2,1,"msgfr6_TY&*ghkjh",1,0,0],["גת ונרגילה אדם","6284","504698272",0,0,5,0,10,2,5,0,2,1,"m66h4_TY&*fopkr",1,0,0],["תנובת השדה","6025","523640654",0,0,0,0,6,0,0,1,0,1,"msgfr6_TY&*ghkjh",1,0,0],["המקום של שובי","6053","528388880",5,5,10,0,0,5,0,0,5,1,"66jh6_TY&*gsejh",1,0,0],["קואוי עיצובים בע\\"מ","6030","502844123",0,0,0,0,2,2,2,0,2,1,"msgfr6_TY&*ghkjh",1,0,0]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[{"value":"גת XP","label":"גת XP"},{"value":"גת XR","label":"גת XR"},{"value":"גת SP מובחר","label":"גת SP מובחר"},{"value":"גת SPXP","label":"גת SPXP"},{"value":"קימבו גדול","label":"קימבו גדול"},{"value":"הרנה 250 גרם","label":"הרנה 250 גרם"},{"value":"אבו מיסמר גדול","label":"אבו מיסמר גדול"},{"value":"אבו מיסמר קטן","label":"אבו מיסמר קטן"},{"value":"קימבו קטן","label":"קימבו קטן"}],[[null,null,"פריט","XP100BG","XR100BG","SP250BG","SX250BG","KI","KI","HI","AB","AB",null,null,null,null,null],[null,null,"במלאי",92,50,125,36,120,95,75,40,40,null,null,null,null,null],[null,null,"בהזמנה",69,44,91,9,185,99,72,64,50,null,null,null,null,null],[null,null,"נותר",23,6,34,27,-65,-4,3,-24,-10,null,null,null,null,null]]]',
        isBI: false,
        isProduced: false,
        isInitiated: false,
        counter: 0,
        innerLog: [],
        createdAt: "2022-12-29T10:06:01.216Z",
        updatedAt: "2022-12-29T10:29:22.326Z",
        __v: 0,
      },
    ],
  },
  testMsg: { status: 200 },
};

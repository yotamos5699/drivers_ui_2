import axios from "axios";
const messageEndURL =
  "https://script.google.com/macros/s/AKfycbzUpsKhJQ_vQkw6Y99GPj1-y77jFYm8XTnWRg-nbeaCd7YTN1kU8JLeFwrZoo9DmUae/exec?type=message";
const ResApiUrl =
  "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec?type=getmessages";
const ResApiUrl2 = "https://script.google.com/macros/s/AKfycbwYsPdgqWD6QNjllH8ZB_-Wde6br0CYcXUE2yShDvGb0486ojgzEKkF5_HbBb5Q34iV/exec";

interface msg {
  isExist: boolean;
  content: string | null;
  id: string;
}
export const udateMessageContent = (idx: any, messages: any) => {
  let data = messages.data.map((msg: any, index: number) => {
    if (idx === index) return { ...msg, content: msg.content ? msg.content : "אין הודעה ללקוח" };
    else return msg;
  });
  return { data: data };
};

export const getMessageEnd = async () => {
  return await axios(messageEndURL, {
    withCredentials: false,
  }).then((res) => {
    return res.data;
  });
};

export const updateMessageInDB = async (message: string, id: string) => {
  await axios(ResApiUrl2 + "?" + `type=updatemessages&id=${id}&content=${message}`, {
    withCredentials: false,
  }).then((res) => console.log(res.data));
};

export const udateCurrentContent = (idx: any, messages: any, value: any) => {
  let data = messages.data.map((msg: any, index: number) => {
    if (idx === index) return { ...msg, content: value };
    else return msg;
  });
  return { data: data };
};
export const updateMessageIsExist = (messages: any) => {
  console.log("in messsages is exist !!!!!!!");

  return {
    data: messages.data.map((msg: any, i: number) => {
      console.log("msg in ssssssssssss", msg.content);
      return {
        ...msg,
        isExist: msg.content && msg.content != "אין הודעה ללקוח" ? true : false,
      };
    }),
  };
};
export const initializeMessages = async (messages: any, setIsInitiated: Function, setMessages: any) => {
  console.log("in is initiated function");

  const result: msg[] = await axios
    .get(ResApiUrl, {
      withCredentials: false,
    })
    .then((res) => {
      console.log({ res });
      setIsInitiated({ data: true });
      return res.data;
    })
    .catch((e) => {
      console.log;
      return e;
    });
  const newData: msg[] = messages.data;

  if (messages?.data !== null) {
    for (let i = 0; i <= messages.data.length - 1; i++) {
      result.forEach((msg: msg) => {
        if (msg.id == messages.data[i].id) newData[i] = { ...msg };
      });
    }
  }
  setMessages({ data: [...newData] });
};

export const constructSmses = async (sms: boolean[], tasks: any[], matrix: any, msgEnd: any) => {
  console.log({ matrix, msgEnd });
  let messages = [];
  let numbers = [];

  for (let i = 0; i <= sms.length - 1; i++) {
    if (!sms[i]) continue;
    let message = `שלום ${tasks[i]["שם"]} מצורף פירוט המשלוח\n`;

    for (let j = 0; j <= matrix.AccountKey.length - 1; j++) {
      if (tasks[i]["id"] == matrix.AccountKey[j]) {
        matrix.cellsData[j].forEach((cell: any, idx: number) => {
          if (matrix.cellsData[j][idx]) message += "- " + matrix.cellsData[j][idx] + " יח של " + matrix.itemsHeaders[idx] + "\n";
        });
        message;
      }
    }
    message += msgEnd.msg ? msgEnd.msg : "\n לבירורים ופרטים נוספים לגבי משלוח הגת, לחצו כאן: https://wa.me/0545940054";
    messages.push(message);

    if (msgEnd.testing) {
      numbers.push("972" + msgEnd.testNum);
    } else {
      console.log("not testing");
      numbers.push("972" + tasks[i]["נייד"]);
    }
  }
  const res = await sendMessages(numbers, messages);
};

export const sendMessages = async (numbers: any[], messages: any[]) => {
  console.log({ numbers, messages });
  const url = "https://gat-avigdor-wa-server.onrender.com/api/sendMsgs";
  // const url = "http://localhost:5000/api/sendMsgs";

  return axios
    .post(
      url,
      {
        numbers: numbers,
        msg: messages,
      },
      { withCredentials: false }
    )
    .then((res) => console.log(JSON.stringify(res)))
    .catch((e) => e);
};

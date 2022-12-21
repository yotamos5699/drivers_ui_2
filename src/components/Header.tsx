import { useState } from "react";
import { backToLogin } from "../helper";
import Model from "./Model";

type headerProps = {
  render: any;
  user: any;
  setRender: any;
};

function Header(props: headerProps) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(!visible);
  };
  return (
    <div className="hdr1">
      <h2>שלום {props?.user?.name}</h2>
      <div className="flex-auto text-center bg-blue-300">
        {props.render?.table
          ? "המשימות של היום "
          : props.render?.details
          ? "פירוט"
          : props.render?.pay
          ? "תשלום"
          : "כלום"}
      </div>
      <button className={"border-pink-400"} onClick={() => backToLogin(props.setRender, props.render)}>
        התנתק
      </button>
      <button className={"border-pink-400"} onClick={() => backToLogin(props.setRender, props.render)}>
        סיכום
      </button>
      {visible && <Model handleClick={handleClick} />}
    </div>
  );
}

export default Header;

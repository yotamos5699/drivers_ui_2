import React from "react";
import { render } from "react-dom";

type headerProps = {
  render: any;
  user: any;
};

function Header(props: headerProps) {
  return (
    <div className="hdr1">
      <h2>שלום {props?.user?.name}</h2>
      <div className="flex-auto text-center bg-blue-300">
        {props.render.table ? "המשימות של היום " : props.render.details ? "פירוט" : props.render.pay ? "תשלום" : "כלום"}
      </div>
    </div>
  );
}

export default Header;

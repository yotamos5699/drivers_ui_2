import { CSS } from "@dnd-kit/utilities";
import { BiNavigation, BiDetail } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
import { AiOutlineMessage, AiOutlinePhone } from "react-icons/ai";
export default function DataRow(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    // isDragging,
  } = useSortable({ id: props.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),

    //:center,
  };

  //   url = q=Hawaii";
  //   Intent intent = new Iddntent(Intent.ACTION_VIEW, Uri.parse(url));
  //   startActivity(intent);
  // } catch (ActivityNotFoundException ex) {
  //   // If Waze is not installed, open it in Google Play:
  //   Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.waze"));
  //   startActivity(intent);
  // }

  return (
    <div
      className={`flex flex-col items-center px-2 py-4 w-4/5 ${
        props.row.isDone ? "bg-gray-400" : "bg-gray-100"
      } shadow-md rounded-md gap-1 touch-none`}
      ref={props.movment.data ? setNodeRef : null}
      id={props.id}
      {...attributes}
      {...listeners}
      style={style}
      //  onClick={(e) => props.handleClick(e, props)}
    >
      <div className="flex gap-4 border-spacing-4 ">
        <span className="flex-1/16 font-bold"> שם </span>
        <span> {props.row["שם"]} </span>
        <span className="flex-1/16 font-bold"> נייד </span>
        <span> {props.row["נייד"]} </span>
        <a className="flex shadow-sm" href={`tel:+972${props.row["נייד"]}`}>
          {" "}
          <span className="flex-1/16 font-bold text-purple-400" id={"dial"}>
            חייג
          </span>
          <span id={"dial"} className="flex-1/16">
            <AiOutlinePhone
              className="flex"
              color={"purple"}
              size={40}
              href={`tel:+972${props.row["נייד"]}`}
              id={"dial"}
            />
          </span>
        </a>
      </div>
      <div className="flex gap-4">
        <a
          className="flex gap-2"
          href={`https://www.waze.com/ul?q=${new URLSearchParams(props.row["כתובת"])}&navigate=yes`}
        >
          <span className="font-bold"> כתובת </span>

          <span> {props.row["כתובת"]} </span>
          <span className="font-bold text-green-500" id={"navigate"}>
            נווט
          </span>
          <span className="items-center" id={"navigate"}>
            <BiNavigation size={40} color={"green"} className="font-bold" id={"navigate"} />{" "}
          </span>
        </a>
      </div>
      <div className="flex gap-2" id={"details"}>
        <div className="flex mx-4">
          <span className="font-bold" id={"details"}>
            פרטים{" "}
          </span>

          <span className="icn1" id={"details"}>
            <BiDetail className="" size={40} id="details" />
          </span>
        </div>
        <div className="flex">
          <span className="font-bold" id={"isDone"}>
            בוצע{" "}
          </span>
          <span className="inline-flex items-center" id={"isDone"}>
            <input
              className=" w-8 h-8"
              id="isDone"
              type={"checkbox"}
              //   value={props.row["isDone"]}
              onChange={(e) => props.handleDragEnd(e, props)}
              checked={props.row["isDone"]}
            />
          </span>
        </div>
        {/* <span>
        <AiOutlineMessage
          className={`icn1${props.row["msg"]&& "text-green-400"}`}
          id="msg"
         
          //   value={props.row["isDone"]}
          onChange={(e) => props.handleDragEnd(e, props)}
       
        
        />

        </span> */}
      </div>
      {/* </td> */}
    </div>
  );
}

// export const messageBox =(props:any)=>{
//       return <input type={"text"}>
//       </input>
// }

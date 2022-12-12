import { CSS } from "@dnd-kit/utilities";
import { BiNavigation, BiDetail } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
import { AiOutlinePhone } from "react-icons/ai";
export default function DataRow(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),

    //:center,
  };

  return (
    <div
      className={"flex flex-col items-center px-2 py-4 w-4/5 bg-gray-100 shadow-md rounded-md gap-1 touch-none"}
      ref={setNodeRef}
      id={props.id}
      {...attributes}
      {...listeners}
      style={style}
      //  onClick={(e) => props.handleClick(e, props)}
    >
      <div className="flex gap-2">
        <span className="font-bold"> שם </span>
        <span> {props.row["שם"]} </span>
        <span className="font-bold"> נייד </span>
        <span> {props.row["נייד"]} </span>
        <a className="flex" href={`tel:+972${props.row["נייד"]}`}>
          {" "}
          <span className="font-bold" id={"dial"}>
            חייג
          </span>
          <span id={"dial"}>
            <AiOutlinePhone href={`tel:+972${props.row["נייד"]}`} id={"dial"} />
          </span>
        </a>
      </div>
      <div className="flex gap-2">
        <span className="font-bold"> כתובת </span>

        <span> {props.row["כתובת"]} </span>
        <span className="font-bold" id={"navigate"}>
          נווט
        </span>
        <span className="items-center" id={"navigate"}>
          <BiNavigation className="font-bold" id={"navigate"} />{" "}
        </span>
      </div>
      <div className="flex gap-2" id={"details"}>
        <span className="font-bold" id={"details"}>
          פרטים{" "}
        </span>

        <span className="icn1" id={"details"}>
          <BiDetail id="details" />
        </span>
        <span className="font-bold" id={"isDone"}>
          בוצע{" "}
        </span>
        <span id={"isDone"}>
          <input
            className="icn1"
            id="isDone"
            type={"checkbox"}
            //   value={props.row["isDone"]}
            onChange={(e) => props.handleDragEnd(e, props)}
            checked={props.row["isDone"]}
          />
        </span>
      </div>
      {/* </td> */}
    </div>
  );
}

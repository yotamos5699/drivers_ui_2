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
      onClick={(e) => props.handleClick(e, props)}
    >
      <div className="flex gap-2">
        <span className="font-bold"> שם </span>
        <span> {props.row["שם"]} </span>
        <span className="font-bold"> נייד </span>
        <span> {props.row["נייד"]} </span>
        <span className="font-bold">חייג</span>
        <span>
          <AiOutlinePhone />
        </span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold"> כתובת </span>
        <span> {props.row["כתובת"]} </span>
        <span className="font-bold">נווט</span>
        <span className="items-center">
          <BiNavigation className="font-bold" />{" "}
        </span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold">פרטים </span>

        <span className="icn1">
          <BiDetail id="details" />
        </span>
        <span className="font-bold">בוצע </span>
        <span>
          <input
            className="icn1"
            id="isDone"
            type={"checkbox"}
            onChange={(e) => props.handleClick(e, props)}
            checked={props.row["isDone"]}
          />
        </span>
      </div>
      {/* </td> */}
    </div>
  );
}

id: 0;
isDone: false;
חוב: -390;
כתובת: 'רש"י 1';
נייד: "505933420";
שם: "קסם משקאות";

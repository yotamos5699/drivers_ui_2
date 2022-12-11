import { CSS } from "@dnd-kit/utilities";
import { BiNavigation, BiDetail } from "react-icons/bi";
import { useSortable } from "@dnd-kit/sortable";
export default function DataRow(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    border: "2px solid black",
    marginBottom: 5,
    marginTop: 20,
  };
  let rData = props.row;

  return (
    <tr
      className="text-center"
      ref={setNodeRef}
      id={props.id}
      {...attributes}
      {...listeners}
      style={style}
      onClick={(e) => props.handleClick(e, props)}
    >
      {Object.values(props.row).map((cell: any, idx) => {
        // console.log(cell, "header ", props.headers[idx]);
        return (
          props.headers[idx] != "isDone" && (
            <td
            // className="td"
            //key={idx}
            >
              {cell == 0 ? 0 : cell ? cell : "noData"}
            </td>
          )
        );
      })}
      <td id="details" className="td">
        <BiDetail id="details" className={"icn1"} />
      </td>
      <td id="nav" className="td">
        <BiNavigation className={"icn1"} />
      </td>
      {/* // <td id="isDone" className="td"> */}
      <td>
        <input
          id="isDone"
          type={"checkbox"}
          onChange={(e) => props.handleClick(e, props)}
          checked={props.row["isDone"]}
        />
      </td>
      {/* </td> */}
    </tr>
  );
}

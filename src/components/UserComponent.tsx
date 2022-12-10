import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BiNavigation, BiDetail } from "react-icons/bi";

const UserComponent = (props: any) => {
  const { setNodeRef, attributes, listeners, transition, transform, isDragging } = useSortable({ id: props.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    border: "2px solid black",
    marginBottom: 5,
    marginTop: 5,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <tr onClick={(e) => props.handleClick(e, props)}>
        {Object.values(props.row).map((cell: any, idx) => {
          // console.log(cell, "header ", props.headers[idx]);
          return (
            props.headers[idx] != "isDone" && (
              <td
                // className="td"
                key={idx}
              >
                {cell ? cell : "noData"}
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

      {props.name}
    </div>
  );
};

export default UserComponent;

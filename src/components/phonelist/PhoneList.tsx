import React from "react";
import Draggable from "react-draggable";
import { Phone } from "../../ts/types";

function PhoneList(props: {
  phones: Phone[];
  onDrag: (phone: Phone, rect: any) => void;
}) {
  return (
    <div style={{backgroundColor: "black"}}>
      {props.phones.map((p, i) => {
        return (
          <DraggablePhone
            phone={p}
            index={i}
            key={p.name}
            imageSrc={p.image as string}
            onDrag={(p,rect) => props.onDrag(p, rect)}
          ></DraggablePhone>
        );
      })}
    </div>
  );
}

function DraggablePhone(props: {
  phone: Phone;
  index: number;
  imageSrc: string;
  onDrag: (phone: Phone, rect: any) => void;
}) {
  const file = "/images/phones/" + props.imageSrc;
  function onStart() {
    console.log("started drag");
  }

  function onStop(e: any, data: any) {
    console.log("stopped drag");
    const rect = data.node.getBoundingClientRect();
    props.onDrag(props.phone, rect);
  }

  function onDrag(e: any, data: any) {
    const rect = data.node.getBoundingClientRect();
    props.onDrag(props.phone, rect);
  }
  const dragHandlers = { onStart: onStart, onStop: onStop };
  return (
    <Draggable {...dragHandlers} onDrag={onDrag}>
      <div
        style={{
          position: "absolute",
          display: "flex",
          zIndex: 20,
          justifyContent: "center", //TODO why won't this work?
          top: 40+props.index * 110,
        }}
      >
        <img
          src={file}
          height="80"
          width="40"
          alt=""
          style={{ pointerEvents: "none" }}
        ></img>
      </div>
    </Draggable>
  );
}

export default PhoneList;

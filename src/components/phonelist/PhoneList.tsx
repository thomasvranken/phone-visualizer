import React from "react";
import Draggable from "react-draggable";
import { calcImgHeight, calcImgWidth } from "../../ts/phoneImage";
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
  let right = props.index % 2 === 1 ? 20 : 40
  return (
    <Draggable {...dragHandlers} onDrag={onDrag}>
      <div
        style={{
          position: "absolute",
          display: "flex",
          zIndex: 20,
          justifyContent: "center", //TODO why won't this work?
          top: 30+props.index * (70),
          right: right
        }}
      >
        <img
          src={file}
          height={calcImgHeight(props.phone)}
          width={calcImgWidth(props.phone)}
          alt=""
          style={{ pointerEvents: "none" }}
        ></img>
      </div>
    </Draggable>
  );
}

export default PhoneList;

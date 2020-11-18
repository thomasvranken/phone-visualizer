import React from "react";
import { CustomButton } from "../button/CustomButton";
import { Category } from "../../ts/category";

export function OverviewButton(props: {
  highlight: boolean;
  onClick: (category: Category) => void;
}) {
  return (
    <CustomButton
      name="overzicht"
      color="red"
      highlight={props.highlight}
      onClick={() => props.onClick}
    />
  );
}

export function CameraButton(props: {
  highlight: boolean;
  onClick: (category: Category) => void;
}) {
  return (
    <CustomButton
      name="camera"
      color="orange"
      highlight={props.highlight}
      onClick={() => props.onClick}
    />
  );
}

export function BatteryButton(props: {
  highlight: boolean;
  onClick: (category: Category) => void;
}) {
  return (
    <CustomButton
      name="batterij"
      color="yellow"
      highlight={props.highlight}
      onClick={() => props.onClick}
    />
  );
}

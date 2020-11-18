import React from "react";
import { Category } from "../../ts/category";
import { Button } from "@material-ui/core";

type propType = {
  name: string;
  color: string;
  classes?: string[];
  highlight: boolean;
  onClick: () => void;
};
export function CustomButton({
  name,
  color,
  classes,
  highlight,
  onClick
}: propType) {
  let classNames = "btn " + classes?.join(" ");
  let style = {};
  if (highlight) {
    style = {
      backgroundColor: color
    };
  } else {
    classNames += " btn-secondary";
  }
  return (
  <Button onClick={() => onClick()}>{name}</Button>
    // <button
    //   type="button"
    //   className={classNames}
    //   style={style}
    //   onClick={() => onClick()}
    // >
    //   {name}
    // </button>
  );
}

export function CategoryButton({
  name,
  category,
  highlight,
  onClick
}: {
  name: string;
  category: Category;
  highlight: boolean;
  onClick: (category: Category) => void;
}) {
  function updateCurrentCategory(category: Category) {
    onClick(category);
  }

  return (
    <div>
      <CustomButton
        name={name}
        color={category.color}
        highlight={highlight}
        onClick={() => updateCurrentCategory(category)}
      />
    </div>
  );
}

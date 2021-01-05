import React from "react";
import { CategoryRepository } from "../../ts/repository";
import { Category } from "../../ts/category";
import { Button, Box } from "@material-ui/core";
import "./LeftContainer.css";
import { BUTTON_COLOR, getContrast } from "../../js/colors";

function LeftContainer(props: {
  categories: CategoryRepository;
  active: Category;
  onClick: (category: Category) => void;
}) {
  function shouldHighlight(category: Category) {
    return props.active.name === category.name;
  }
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      alignContent="space-around"
      height="100%"
    >
      <CatButton
        category={props.categories.main}
        highlight={shouldHighlight(props.categories.main)}
        onClick={() => props.onClick(props.categories.main)}
      ></CatButton>
      <CatButton
        category={props.categories.price}
        highlight={shouldHighlight(props.categories.price)}
        onClick={() => props.onClick(props.categories.price)}
      ></CatButton>
      <CatButton
        category={props.categories.camera}
        highlight={shouldHighlight(props.categories.camera)}
        onClick={() => props.onClick(props.categories.camera)}
      ></CatButton>
      <CatButton
        category={props.categories.battery}
        highlight={shouldHighlight(props.categories.battery)}
        onClick={() => props.onClick(props.categories.battery)}
      ></CatButton>
      <CatButton
        category={props.categories.memory}
        highlight={shouldHighlight(props.categories.memory)}
        onClick={() => props.onClick(props.categories.memory)}
      ></CatButton>
      <CatButton
        category={props.categories.os}
        highlight={shouldHighlight(props.categories.os)}
        onClick={() => props.onClick(props.categories.os)}
      ></CatButton>
      <CatButton
        category={props.categories.screen}
        highlight={shouldHighlight(props.categories.screen)}
        onClick={() => props.onClick(props.categories.screen)}
      ></CatButton>
      <CatButton
        category={props.categories.connect}
        highlight={shouldHighlight(props.categories.connect)}
        onClick={() => props.onClick(props.categories.connect)}
      ></CatButton>
      <CatButton
        category={props.categories.feature}
        highlight={shouldHighlight(props.categories.feature)}
        onClick={() => props.onClick(props.categories.feature)}
      ></CatButton>
    </Box>
  );
}

export function CatButton(props: {
  category: Category;
  highlight: boolean;
  onClick: () => void;
}) {
  // const color = props.highlight ? props.category.color : "#D3D3D3";
  // NOTE: for some reason, this implementation slows down rendering by A LOT
  // const ColorButton = withStyles((theme: Theme) => ({
  //   root: {
  //     color: theme.palette.getContrastText(color),
  //     backgroundColor: color,
  //   },
  // }))(Button);
  // return (
  // <ColorButton
  //   variant="contained"
  //   className="btn-category"
  //   onClick={() => props.onClick()}
  // >
  //   {props.category.name}
  // </ColorButton>
  // );
  // More efficient implementation with similar result
  // let background = props.highlight ? props.category.color : "#D3D3D3";
  let background = props.highlight ? BUTTON_COLOR : "#D3D3D3";
  let color = getContrast(background);
  return (
    <Button
      style={{
        backgroundColor: background,
        color: color,
      }}
      variant="contained"
      disableElevation
      className="btn-category"
      onClick={() => props.onClick()}
    >
      {props.category.name}
    </Button>
  );
}

export default LeftContainer;

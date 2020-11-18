import React from "react";
import { CategoryRepository } from "../../ts/repository";
import { Category } from "../../ts/category";
import { Button, Box, withStyles, Theme } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

//TODO fix any type and highlight logic
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
        category={props.categories.price}
        highlight={shouldHighlight(props.categories.price)}
        onClick={() => props.onClick(props.categories.price)}
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
  const color = props.highlight ? props.category.color : "#D3D3D3";
  const ColorButton = withStyles((theme: Theme) => ({
    root: {
      color: theme.palette.getContrastText(color),
      backgroundColor: color,
      // "&:hover": {
      //   backgroundColor: green[400],
      // },
    },
  }))(Button);
  return (
    // <Button variant="contained" color="primary" onClick={() => props.onClick()}>
    //   {props.category.name}
    // </Button>
    <ColorButton variant="contained" onClick={() => props.onClick()}>{props.category.name}
    </ColorButton>
  );
}

export default LeftContainer;

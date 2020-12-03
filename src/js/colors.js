import * as d3 from "d3";
import * as colorable from "colorable";

export const categoryColors = {
  main: d3.schemeCategory10[9],
  price: d3.schemeCategory10[5],
  camera: d3.schemeCategory10[4],
  battery: d3.schemeCategory10[1],
  memory: d3.schemeCategory10[0],
  cpu: d3.schemeCategory10[2],
  screen: d3.schemeCategory10[3],
  connectivity: d3.schemeCategory10[7],
  features: d3.schemeCategory10[8],
};

export function getContrast(color) {
  let colors = {
    c: color,
    white: "white",
    black: "black",
  }
  let result = colorable(colors, { compact: true, threshold: 0 })
  let black = result[0].combinations[1].contrast
  let white = result[0].combinations[0].contrast
  if (black > white) {
    return colors.black
  } return colors.white
}

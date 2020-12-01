import React from "react";
import GraphContainer from "../graph/GraphContainer";
import { Graph } from "../../ts/draw";
import { TrackedPhone, Phone } from "../../ts/types";
import { Box, ButtonGroup, Button, withStyles, Theme } from "@material-ui/core";
import { Category, MainCategory } from "../../ts/category";
import PhoneStrip from "../phonestrip/PhoneStrip";
import { PhoneRepository } from "../../ts/repository";
import classes from "*.module.css";

function MiddleContainer(props: {
  phoneRepo: PhoneRepository;
  active: Category;
  trackedPhones: TrackedPhone[];
  onGraphChange: (graph: Graph) => void;
}) {
  function drawButton(graph: Graph) {
    const color =
      props.active.currentGraph === graph ? props.active.color : "#D3D3D3";
    const ColorButton = withStyles((theme: Theme) => ({
      root: {
        color: theme.palette.getContrastText(color),
        backgroundColor: color,
      },
    }))(Button);
    return (
      <ColorButton onClick={() => props.onGraphChange(graph)} key={graph.name}>
        {graph.name}
      </ColorButton>
    );
  }

  if (props.active instanceof MainCategory) {
    return (
      <Box height={1} display="flex" flexDirection="column">
        <Box flexGrow={1} display="flex">
          <GraphContainer
            phoneRepo={props.phoneRepo}
            graph={props.active.currentGraph}
            trackedPhones={props.trackedPhones}
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box height={1} display="flex" flexDirection="column">
        <Box style={{ height: "40px" }}>
          <ButtonGroup color="primary">
            {props.active.graphs.map((graph) => drawButton(graph))}
          </ButtonGroup>
        </Box>
        <Box flexGrow={1} display="flex">
          <GraphContainer
            phoneRepo={props.phoneRepo}
            graph={props.active.currentGraph}
            trackedPhones={props.trackedPhones}
          />
        </Box>
        <Box style={{ height: "20%" }}>
          <PhoneStrip></PhoneStrip>
        </Box>
      </Box>
    );
  }
}

export default MiddleContainer;

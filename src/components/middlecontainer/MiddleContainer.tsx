import React from "react";
import GraphContainer from "../graph/GraphContainer";
import { Graph } from "../../ts/draw";
import { TrackedPhone } from "../../ts/types";
import { Box, ButtonGroup, Button } from "@material-ui/core";
import { Category, FeaturesCategory, MainCategory } from "../../ts/category";
import PhoneStrip from "../phonestrip/PhoneStrip";
import { PhoneRepository } from "../../ts/repository";
import { BUTTON_COLOR, getContrast } from "../../js/colors";
import { FeaturesTable } from "../table/Table";

function MiddleContainer(props: {
  phoneRepo: PhoneRepository;
  active: Category;
  trackedPhones: TrackedPhone[];
  onGraphChange: (graph: Graph) => void;
}) {
  function drawButton(graph: Graph) {
    // const background =
    //   props.active.currentGraph === graph ? props.active.color : "#D3D3D3";
    const background =
      props.active.currentGraph === graph ? BUTTON_COLOR : "#D3D3D3";
    let color = getContrast(background) as string;
    return (
      <Button
        onClick={() => props.onGraphChange(graph)}
        key={graph.name}
        style={{
          color: color,
          backgroundColor: background,
        }}
      >
        {graph.name}
      </Button>
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
  } else if (props.active instanceof FeaturesCategory) {
    return (
      <Box height={1} display="flex" flexDirection="column">
        <Box flexGrow={1} display="flex" style={{ height: "60%" }}>
          <FeaturesTable
            phoneRepo={props.phoneRepo}
            trackedPhones={props.trackedPhones}
          ></FeaturesTable>
        </Box>
        <Box style={{ height: "20%" }}>
          <PhoneStrip></PhoneStrip>
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
        <Box flexGrow={1} display="flex" style={{ height: "60%" }}>
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

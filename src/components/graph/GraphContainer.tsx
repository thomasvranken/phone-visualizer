import React, { useEffect, useRef } from "react";
import { Graph } from "../../ts/draw";
import { TrackedPhone } from "../../ts/types";
import { Container } from "@material-ui/core";
import { PhoneRepository } from "../../ts/repository";

export const chartId = "chart-area";

function GraphContainer(props: {
  phoneRepo: PhoneRepository;
  graph: Graph;
  trackedPhones: TrackedPhone[];
}) {
  const graphRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (graphRef.current) {
      let rect = graphRef.current.getBoundingClientRect();
      let graphWidth = rect.width;
      let graphHeight = rect.height;
      props.graph.draw(
        props.phoneRepo,
        props.trackedPhones,
        graphWidth,
        graphHeight
      );
    }
  });

  return (
    <Container ref={graphRef} id={chartId} disableGutters={true}>
      {" "}
    </Container>
  );
}

export default GraphContainer;

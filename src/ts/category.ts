import { PhotoChart, Graph, BatteryWifiChart, VideoChart, CameraGeneralChart, BasePriceChart, WorkingMemoryChart, CPUPowerChart, StorageChart } from "./draw";
import * as d3 from "d3";
import { MainGraph } from "./drawMain";
import { CameraSpecs } from "./drawSpecs";

/**
 * A generic class representing a category of properties for smartphone.
 * A category should be linked to a button in the left column of the app.
 * Each category should extend this class.
 */
export class Category {
  graphs: Graph[];
  currentGraph: Graph;
  color: string;
  name: string;

  constructor(name: string, graphs: Graph[], color: string) {
    this.name = name;
    this.graphs = graphs;
    this.currentGraph = this.graphs[0];
    this.color = color;
  }
}

/**
 * The main category, which consists of a single graph 
 * for displaying the most important properties.
 */
export class MainCategory extends Category {
  constructor() {
    super("overzicht",[new MainGraph()], d3.schemeCategory10[0]);
  }
}

/**
 * The camera category, which consists of multiple graphs related to DXO scores.
 */
export class CameraCategory extends Category {
  constructor() {
    super("camera",[new CameraGeneralChart(), new PhotoChart(), new VideoChart(), new CameraSpecs()], d3.schemeCategory10[0]);
  }
}

export class BatteryCategory extends Category {
  constructor() {
    super("batterij",[new BatteryWifiChart()], d3.schemeCategory10[1]);
  }
}

export class PriceCategory extends Category {
  constructor() {
    super("prijs",[new BasePriceChart()], d3.schemeCategory10[2]);
  }
}

export class MemoryCategory extends Category {
  constructor() {
    super("geheugen en opslag",[new WorkingMemoryChart(), new StorageChart()], d3.schemeCategory10[3]);
  }
}

export class OSCategory extends Category {
  constructor() {
    super("OS en processor",[new CPUPowerChart()], d3.schemeCategory10[4]);
  }
}

export class ScreenCategory extends Category {
  constructor() {
    super("Scherm en weergave",[], d3.schemeCategory10[5]);
  }
}

export class ConnectivityCategory extends Category {
  constructor() {
    super("Connectiviteit",[], d3.schemeCategory10[6]);
  }
}

export class FeaturesCategory extends Category {
  constructor() {
    super("Poorten en features",[], d3.schemeCategory10[7]);
  }
}

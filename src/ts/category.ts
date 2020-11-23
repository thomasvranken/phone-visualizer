import { PhotoChart, Graph, BatteryWifiChart, VideoChart, CameraGeneralChart, BasePriceChart, WorkingMemoryChart, CPUPowerChart, StorageChart, DisplayContrastSunChart } from "./draw";
import * as d3 from "d3";
import { MainGraph } from "./drawMain";
import { BatterySpecs, CameraSpecs } from "./drawSpecs";

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

export const categoryColors = {
  "main": d3.schemeCategory10[9],
  "price": d3.schemeCategory10[5],
  "camera": d3.schemeCategory10[0],
  "battery": d3.schemeCategory10[1],
  "memory": d3.schemeCategory10[8],
  "cpu": d3.schemeCategory10[2],
  "screen": d3.schemeCategory10[3],
  "connectivity": d3.schemeCategory10[7],
  "features": d3.schemeCategory10[4],
}

/**
 * The main category, which consists of a single graph 
 * for displaying the most important properties.
 */
export class MainCategory extends Category {
  constructor() {
    super("overzicht",[new MainGraph()], categoryColors.main);
  }
}

/**
 * The camera category, which consists of multiple graphs related to DXO scores.
 */
export class CameraCategory extends Category {
  constructor() {
    super("camera",[new CameraGeneralChart(), new PhotoChart(), new VideoChart(), new CameraSpecs()], categoryColors.camera);
  }
}

export class BatteryCategory extends Category {
  constructor() {
    super("batterij",[new BatteryWifiChart(), new BatterySpecs()], categoryColors.battery);
  }
}

export class PriceCategory extends Category {
  constructor() {
    super("prijs",[new BasePriceChart()], categoryColors.price);
  }
}

export class MemoryCategory extends Category {
  constructor() {
    super("geheugen en opslag",[new WorkingMemoryChart(), new StorageChart()], categoryColors.memory);
  }
}

export class OSCategory extends Category {
  constructor() {
    super("OS en processor",[new CPUPowerChart()], categoryColors.cpu);
  }
}

export class ScreenCategory extends Category {
  constructor() {
    super("Scherm en weergave",[new DisplayContrastSunChart()], categoryColors.screen);
  }
}

export class ConnectivityCategory extends Category {
  constructor() {
    super("Connectiviteit",[], categoryColors.connectivity);
  }
}

export class FeaturesCategory extends Category {
  constructor() {
    super("Poorten en features",[], categoryColors.features);
  }
}

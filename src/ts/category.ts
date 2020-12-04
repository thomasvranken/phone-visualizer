import {
  PhotoChart,
  Graph,
  BatteryWifiChart,
  VideoChart,
  CameraGeneralChart,
  BasePriceChart,
  WorkingMemoryChart,
  CPUPowerChart,
  StorageChart,
  DisplayContrastSunChart,
  DisplayMaxBrightnessChart,
  DisplayMinBrightnessChart,
  BatteryVideoChart,
} from "./draw";
import { MainGraph } from "./drawMain";
import {
  BatterySpecs,
  CameraSpecs,
  ConnectivitySpecs,
  CPUSpecs,
  DisplaySpecs,
  ExtraFeaturesSpecs,
  MemorySpecs,
} from "./drawSpecs";
import { categoryColors } from "../js/colors";

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
    super("overzicht", [new MainGraph()], categoryColors.main);
  }
}

/**
 * The camera category, which consists of multiple graphs related to DXO scores.
 */
export class CameraCategory extends Category {
  constructor() {
    super(
      "camera",
      [
        new CameraGeneralChart(),
        new PhotoChart(),
        new VideoChart(),
        new CameraSpecs(),
      ],
      categoryColors.camera
    );
  }
}

export class BatteryCategory extends Category {
  constructor() {
    super(
      "batterij",
      [new BatteryWifiChart(), new BatteryVideoChart(), new BatterySpecs()],
      categoryColors.battery
    );
  }
}

export class PriceCategory extends Category {
  constructor() {
    super("prijs", [new BasePriceChart()], categoryColors.price);
  }
}

export class MemoryCategory extends Category {
  constructor() {
    super(
      "geheugen en opslag",
      [new WorkingMemoryChart(), new StorageChart(), new MemorySpecs()],
      categoryColors.memory
    );
  }
}

export class OSCategory extends Category {
  constructor() {
    super(
      "Systeem en processor",
      [new CPUPowerChart(), new CPUSpecs()],
      categoryColors.cpu
    );
  }
}

export class ScreenCategory extends Category {
  constructor() {
    super(
      "Scherm en weergave",
      [
        new DisplayMaxBrightnessChart(),
        new DisplayMinBrightnessChart(),
        new DisplaySpecs(),
      ],
      categoryColors.screen
    );
  }
}

export class ConnectivityCategory extends Category {
  constructor() {
    super(
      "Connectiviteit",
      [new ConnectivitySpecs()],
      categoryColors.connectivity
    );
  }
}

export class FeaturesCategory extends Category {
  constructor() {
    super(
      "Poorten en features",
      [new ExtraFeaturesSpecs()],
      categoryColors.features
    );
  }
}

import Tuio from "./tuio";
import data from "../data.json";
import {
  CameraCategory,
  Category,
  BatteryCategory,
  PriceCategory,
  OSCategory,
  MemoryCategory,
  ConnectivityCategory,
  ScreenCategory,
  FeaturesCategory,
  MainCategory,
} from "./category";
import { Phone, OverviewProps } from "./types";
import * as d3 from "d3";
import moment from "moment";

export class PhoneRepository {
  tuio: Tuio;
  database: Array<Phone>;
  currentIds: Array<number>;
  /**
   * The set of min values for the properties used in the overview.
   */
  minProps: OverviewProps;
  /**
   * The set of max values for the properties used in the overview.
   */
  maxProps: OverviewProps;

  constructor(tuio: Tuio) {
    this.tuio = tuio;
    this.currentIds = [];
    this.database = this.parseData(data);
    this.minProps = {
      camera: d3.min(this.database.map((p) => p.camera.dxo.general)) || 0,
      battery: d3.min(this.database.map((p) => p.battery.wifi.asHours())) || 0,
      cpu: d3.min(this.database.map((p) => p.cpu.benchmark)) || 0,
      ram: d3.min(this.database.map((p) => p.ram)) || 0,
      storage: d3.min(this.database.map((p) => p.storage)) || 0,
    };
    this.maxProps = {
      camera: d3.max(this.database.map((p) => p.camera.dxo.general)) || 0,
      battery: d3.max(this.database.map((p) => p.battery.wifi.asHours())) || 0,
      cpu: d3.max(this.database.map((p) => p.cpu.benchmark)) || 0,
      ram: d3.max(this.database.map((p) => p.ram)) || 0,
      storage: d3.max(this.database.map((p) => p.storage)) || 0,
    };
    tuio.setRepository(this);
  }

  parseData(data: any): Phone[] {
    let result = JSON.parse(JSON.stringify(data))
    console.log("data before modifying:", result)
    result.forEach((d: any) => {
      d.battery.wifi = moment.duration(
        `${d.battery.wifi.hours}:${d.battery.wifi.minutes}`
      );
      d.camera.specs = new Map(Object.entries(d.camera.specs));
    });
    console.log("data for rest of program:", result)
    return result
  }

  setCurrentIds(ids: number[]) {
    this.currentIds = ids;
  }

  getPhonesWithImage() {
    return this.database.filter((p) => p.image !== undefined);
  }
}

export class CategoryRepository {
  main = new MainCategory();
  camera = new CameraCategory();
  battery = new BatteryCategory();
  price = new PriceCategory();
  memory = new MemoryCategory();
  os = new OSCategory();
  screen = new ScreenCategory();
  connect = new ConnectivityCategory();
  feature = new FeaturesCategory();

  getCategories(): Category[] {
    return Object.values(this);
  }
}

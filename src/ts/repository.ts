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
import { Phone, OverviewProps, TrackedPhone } from "./types";
import * as d3 from "d3";
import moment from "moment";

/**
 * A list containing (semi-)recent android versions since 2016 (from 7 to 11).
 */
export const androidVersions = ["7", "7.1", "8", "8.1", "9", "10", "11"];
/**
 * A list containing (semi-)recent iOS versions since 2016 (from 10 to 14).
 */
export const iOSVersions = ["10", "11", "12", "13", "14"];

/**
 * A list containing (semi-)recent sizes for RAM.
 */
export const RAMSizes = ["2", "3", "4", "6", "8", "10", "12", "16"];

/**
 * A list containing (semi-)recent sizes for long term storage.
 */
export const StorageSizes = ["16", "32", "64", "128", "256", "512"];

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
      ram: d3.min(this.database.map((p) => p.memory.ram)) || 0,
      storage: d3.min(this.database.map((p) => p.memory.storage)) || 0,
    };
    this.maxProps = {
      camera: d3.max(this.database.map((p) => p.camera.dxo.general)) || 0,
      battery: d3.max(this.database.map((p) => p.battery.wifi.asHours())) || 0,
      cpu: d3.max(this.database.map((p) => p.cpu.benchmark)) || 0,
      ram: d3.max(this.database.map((p) => p.memory.ram)) || 0,
      storage: d3.max(this.database.map((p) => p.memory.storage)) || 0,
    };
    tuio.setRepository(this);
  }

  /**
   * Parses the JSON data into an array of Phone objects.
   * @param data
   */
  parseData(data: any): Phone[] {
    let result = JSON.parse(JSON.stringify(data));
    console.log("data before modifying:", result);
    result.forEach((d: any) => {
      d.battery.wifi = moment.duration(
        `${d.battery.wifi.hours}:${d.battery.wifi.minutes}`
      );
      if (d.battery.hasOwnProperty("video")) {
        d.battery.video = moment.duration(
          `${d.battery.video.hours}:${d.battery.video.minutes}`
        );
      }
      d.os.version = d.os.version.toString();
      d.camera.specs = new Map(Object.entries(d.camera.specs));
      d.battery.specs = new Map(Object.entries(d.battery.specs));
      if (d.memory.hasOwnProperty("specs")) {
        d.memory.specs = new Map(Object.entries(d.memory.specs));
      }
      if (d.cpu.hasOwnProperty("specs")) {
        d.cpu.specs = new Map(Object.entries(d.cpu.specs));
      }
      if (d.display.hasOwnProperty("specs")) {
        d.display.specs = new Map(Object.entries(d.display.specs));
      }
      if (d.connectivity.hasOwnProperty("specs")) {
        d.connectivity.specs = new Map(Object.entries(d.connectivity.specs));
      }
      if (d.features.hasOwnProperty("specs")) {
        d.features.specs = new Map(Object.entries(d.features.specs));
      }
      d.inActiveUse = true;
    });
    console.log("data for rest of program:", result);
    return result;
  }

  setCurrentIds(ids: number[]) {
    this.currentIds = ids;
  }

  /**
   * Returns a list of phones which are in active use for the application.
   * This means the they have an image, and the relevant flag is set to true.
   */
  getPhonesInActiveUse() {
    return this.database.filter((p) => p.image !== undefined && p.inActiveUse);
  }

  /**
   * Sets the 'in active use' value of the given phone to the given value.
   * @param phone 
   * @param val 
   */
  setPhoneInActiveUse(phone: Phone, val: boolean) {
    phone.inActiveUse = val
  }

  /**
   * Returns the phone associated with the given tracked phone entity.
   * @param trackedPhone
   *
   */
  findPhone(trackedPhone: TrackedPhone) {
    return this.database.find((p) => p.symbolId === trackedPhone.id);
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

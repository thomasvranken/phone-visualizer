import * as d3 from "d3";
// import {scaleRadial} from "../js/scale-radial.js"
import $ from "jquery";
import { Graph, svgId } from "./draw";
import {
  androidVersions,
  iOSVersions,
  PhoneRepository,
  RAMSizes,
  StorageSizes,
} from "./repository";
import { TrackedPhone, Phone, Price } from "./types";
import smartphoneIcon from "../images/icons/smartphone-icon.png";
import cameraIcon from "../images/icons/camera.png";
import batteryIcon from "../images/icons/battery.png";
import cpuIcon from "../images/icons/cpu_alt.png";
import ramIcon from "../images/icons/ram.png";
import storageIcon from "../images/icons/storage.png";
import osIcon from "../images/icons/os.png";
import euroIcon from "../images/icons/euro.png";
import { categoryColors } from "../js/colors";

/**
 * Width and height of each icon.
 */
const ICON_SIZE = 25;
/**
 * Distance to draw icons from the center of a phone
 */
const ICON_RADIUS = 68;

const minPhonePrice = 99
const ANTUTU_MIN_SCORE = 5000

/**
 * The main graph, a radial chart displaying the most important properties.
 */
export class MainGraph extends Graph {
  constructor() {
    super("overzicht", "overzicht", "");
  }

  /**
   * Draws either a hint for placing smartphones, or the radial charts
   * around tracked phones.
   * @param phoneRepo
   * @param trackedPhones
   * @param containerWidth
   * @param containerHeight
   */
  draw(
    phoneRepo: PhoneRepository,
    trackedPhones: Array<TrackedPhone>,
    containerWidth: number,
    containerHeight: number
  ) {
    // NOTE: containerheight is 0 when changing to main for some reason...
    // This is fixed when moving a phone
    if (containerHeight === 0) {
      containerHeight = 500;
    }
    super.draw(phoneRepo, trackedPhones, containerWidth, containerHeight);
    if (trackedPhones.length === 0) {
      this.drawPlaceSmartphone(svgId);
    } else {
      trackedPhones.forEach((tp) => {
        let phone = phoneRepo.database.find((p) => p.symbolId === tp.id);
        if (phone) {
          this.drawMainGraph(svgId, phone, tp, tp.rect, phoneRepo);
        }
      });
    }
  }

  drawMainGraph(
    svgId: string,
    smartphone: Phone,
    trackedPhone: TrackedPhone,
    rect: any,
    phoneRepo: PhoneRepository
  ) {
    const svg = d3.select("#" + svgId);
    const innerRadius = 52;
    const outerRadius = 200;
    let phoneAbsX = rect.x + rect.width / 2;
    let phoneAbsY = rect.y + rect.height / 2;
    let svgOffset = $("#" + svgId).offset() as JQuery.Coordinates;
    let phoneRelX = phoneAbsX - svgOffset.left;
    let phoneRelY = phoneAbsY - svgOffset.top;
    let svgGroup = svg.append("g").attr("transform", (d) => {
      return "translate(" + phoneRelX + "," + phoneRelY + ")";
    });

    let cameraSlice = new CameraSlice(
      smartphone.camera.dxo.general,
      56, // lowest DXO score
      phoneRepo.maxProps.camera
    );
    let batterySlice = new BatterySlice(
      smartphone.battery.wifi.asHours(),
      0,
      phoneRepo.maxProps.battery
    );
    let cpuSlice = new CPUSlice(
      smartphone.cpu.benchmark,
      ANTUTU_MIN_SCORE,
      phoneRepo.maxProps.cpu
    );
    let ramSlice = new RAMSlice(smartphone.memory.ram);

    let storageSlice = new StorageSlice(smartphone.memory.storage);
    let osSlice = new OSSlice(smartphone.os.version, smartphone.os.type);
    let priceSlice = new PriceSlice(smartphone.price.base, phoneRepo);

    let slices = [
      cameraSlice,
      batterySlice,
      ramSlice,
      cpuSlice,
      storageSlice,
      osSlice,
      priceSlice,
    ];
    let segments = slices.length + 1;
    let start = (1 / (2 * segments)) * 2 * Math.PI;
    let end = (2 * Math.PI * (2 * segments - 1)) / (2 * segments);
    let x = d3
      .scaleBand()
      .range([start, end])
      .domain(slices.map((s) => s.imageName));

    // Draw outer ring
    svgGroup
      .append("circle")
      .attr("r", outerRadius)
      .attr("stroke", "black")
      .attr("fill", "none")
      .style("opacity", 0.1);

    // Arc generator used for the different slices
    let arcGenerator: any = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius((slice: any) => {
        let y = scaleRadial()
          .range([innerRadius, outerRadius])
          /*NOTE: It seems to be impossible to import scaleRadial from d3.
          It probably has something to do with typescript.
          The function is copied at the bottom of this file.*/
          //@ts-ignore: scaleRadial() local is correct.
          .domain([slice.min, slice.max]);
        return y(slice.getValue());
        // let y = d3
        //   .scaleSqrt()
        //   // .scaleLinear()
        //   .range([innerRadius, outerRadius])
        //   .domain([slice.min, slice.max]);
        // return y(slice.getValue());
      })
      .startAngle((slice: any) => {
        return x(slice.imageName) || 0;
      })
      .endAngle((slice: any) => {
        return (x(slice.imageName) || 0) + x.bandwidth();
      })
      .padAngle(0.01)
      .padRadius(outerRadius)
      .cornerRadius(4);

    // Draw slices
    let sliceGroup = svgGroup.append("g");
    sliceGroup
      .attr("class", "slices")
      .selectAll("path")
      .data(slices)
      .enter()
      .append("path")
      .attr("fill", (s) => trackedPhone.color)
      .attr("d", arcGenerator as any);

    // Draw icons
    sliceGroup
      .selectAll("image")
      .data(slices)
      .enter()
      .append("image")
      .each(function (s, i) {
        let arcLength = (Math.PI * 2) / (slices.length + 1);
        let angle = arcLength * (i - 1.0); //TODO value depends on number of slices somehow
        let x = Math.cos(angle) * ICON_RADIUS;
        let y = Math.sin(angle) * ICON_RADIUS;
        d3.select(this)
          .attr("xlink:href", s.imageName)
          .attr("x", x)
          .attr("y", y)
          // .classed("outline-image", true)
          .style("fill", "black")
          .attr("width", ICON_SIZE)
          .attr("height", ICON_SIZE)
          .attr("transform", (d) => {
            let res =
              "translate(" + -ICON_SIZE / 2 + "," + -ICON_SIZE / 2 + ")";
            return res;
          });
      });

    // Draw descriptions
    sliceGroup
      .selectAll(".descr")
      .data(slices)
      .enter()
      .each(function (s, i) {
        let textRadius = 120;
        let arcLength = (Math.PI * 2) / (slices.length + 1);
        let angle = arcLength * (i - 1.0); //TODO value depends on number of slices somehow
        let x = Math.cos(angle) * textRadius;
        let y = Math.sin(angle) * textRadius;
        // let rotate = (angle < Math.PI / 2 ) ? -20 : 20
        let lines = s.getDescription().split("\n");
        lines.forEach((line, i) => {
          sliceGroup
            .append("text")
            .classed("descr", true)
            .text(line)
            .attr("x", x)
            .attr("y", y + i * 15)
            .style("fill", "black")
            .style("text-anchor", "middle")
            .style("font-size", "14");
          // .style("font-weight", "bold")
          // .attr("transform", `rotate(${rotate}, ${x}, ${y})`)
          // .style("dominant-baseline", "middle");
        });
      });

    // Draw brand and name
    let textRadius = outerRadius - 10;
    svgGroup
      .append("g")
      .attr("class", "general")
      .selectAll("general")
      .data([smartphone.brand, smartphone.name])
      .enter()
      .append("text")
      .text((d) => d)
      .attr("transform", (d) => {
        textRadius -= 30;
        let res = "translate(0," + -textRadius + ")";
        return res;
      })
      .style("text-anchor", "middle")
      .style("font-weight", "bold")
      // .style("text-shadow", "1px 1px 2px black")
      .style("fill", "black")
      .style("position", "absolute")
      .style("z-index", 10);
  }

  drawPlaceSmartphone(svgId: string) {
    let text = "Plaats hier een of meerdere smartphones om te beginnen";
    let img1X = "7%";
    let img2X = "73%";
    const svg = d3.select("#" + svgId);
    svg
      .append("image")
      .attr("xlink:href", smartphoneIcon)
      .attr("x", img1X)
      .attr("y", "25%")
      .style("fill", "black")
      .attr("width", "20%")
      .attr("height", "50%");
    svg
      .append("text")
      .attr("x", "50%")
      .attr("y", "50%")
      .text(text)
      .style("fill", "black")
      .style("text-anchor", "middle")
      .style("dominant-baseline", "middle");
    svg
      .append("image")
      .attr("xlink:href", smartphoneIcon)
      .attr("x", img2X)
      .attr("y", "25%")
      .style("fill", "black")
      .attr("width", "20%")
      .attr("height", "50%");
  }
}

/**
 * A class representing a slice of the radial chart.
 * Each slice:
 * - corresponds to a certain property,
 * - has a value scaled between a minimum and maximum,
 * - has a certain color,
 * - and has a title and symbol
 */
class PropertySlice {
  constructor(
    public color: string,
    public value: number,
    public min: number,
    public max: number,
    public imageName: string
  ) {}

  getValue(): number {
    return this.value;
  }

  /**
   * Returns the description to be showed in this slice.
   * Default implementation: score on 10
   */
  getDescription(): string {
    let score = Math.round(
      ((this.value - this.min) / (this.max - this.min)) * 10
    );
    return score + "/10";
  }
}

class CameraSlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super(categoryColors.camera, value, min, max, cameraIcon);
  }

  getDescription(): string {
    let score = (this.value - this.min) / (this.max - this.min);
    return getQualitativeDescr(score);
  }
}

class PriceSlice extends PropertySlice {
  price: Price;
  constructor(price: Price, phoneRepo: PhoneRepository) {
    let value = price.eur + 0.01 * price.cent;
    let prices = phoneRepo.database.map(
      (p) => p.price.base.eur + 0.01 * p.price.base.cent
    );
    let max = Math.max(...prices);
    super(categoryColors.price, value, minPhonePrice, max, euroIcon);
    this.price = price;
  }

  getDescription(): string {
    return `€${this.price.eur},${this.price.cent}`;
  }
}

class BatterySlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super(categoryColors.battery, value, min, max, batteryIcon);
  }

  getDescription(): string {
    let score = (this.value - this.min) / (this.max - this.min);
    return getQualitativeDescr(score);
  }
}

class CPUSlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super(categoryColors.cpu, value, min, max, cpuIcon);
  }

  getDescription(): string {
    let score = ((this.value - this.min) / (this.max - this.min)) * 10;
    if (score > 7) {
      return "Geschikt voor\nintensieve apps";
    } else if (score > 4) {
      return "Snel genoeg voor\nmeeste apps";
    } else {
      return "Enkel simpele\napps";
    }
  }
}

class RAMSlice extends PropertySlice {
  constructor(size: number) {
    let min = 0;
    let max = RAMSizes.length - 1;
    let value = RAMSizes.findIndex((v) => size.toString() === v);
    super(categoryColors.memory, value, min, max, ramIcon);
  }

  getDescription(): string {
    return RAMSizes[this.getValue()] + " GB";
  }
}

class StorageSlice extends PropertySlice {
  constructor(size: number) {
    let c = d3.color(categoryColors.memory)?.brighter(0.5).toString();
    let min = 0;
    let max = StorageSizes.length - 1;
    let value = StorageSizes.findIndex((v) => size.toString() === v);
    super(c || "orange", value, min, max, storageIcon);
  }

  getDescription(): string {
    return StorageSizes[this.getValue()] + " GB";
  }
}

class OSSlice extends PropertySlice {
  osType: string;
  constructor(versionName: string, osType: string) {
    let c = d3.color(categoryColors.cpu)?.brighter(0.5).toString();
    let min, max, value;
    if (osType.toLowerCase() === "android") {
      min = 0;
      max = androidVersions.length - 1;
      value = androidVersions.findIndex((v) => versionName === v);
    } else {
      min = 0;
      max = iOSVersions.length - 1;
      value = iOSVersions.findIndex((v) => versionName === v);
    }
    super(c || "orange", value, min, max, osIcon);
    this.osType = osType;
  }

  getDescription(): string {
    let version =
      this.osType.toLowerCase() === "android"
        ? androidVersions[this.value]
        : iOSVersions[this.value];
    return this.osType + " " + version;
  }
}

/**
 * Returns a qualitative description based on the value between
 * 0 and 1.
 * @param value
 */
function getQualitativeDescr(value: number): string {
  if (value > 0.8) {
    return "Zeer goed";
  } else if (value > 0.6) {
    return "Goed";
  } else if (value > 0.4) {
    return "Matig";
  } else {
    return "Beperkt";
  }
}

/**
 * Copied from https://github.com/d3/d3-scale/issues/90
 * For some reason the function cannot be imported...
 */
function scaleRadial() {
  var domain = [0, 1],
    range = [0, 1];

  function scale(x: any) {
    var r0 = range[0] * range[0],
      r1 = range[1] * range[1];
    return Math.sqrt(
      ((x - domain[0]) / (domain[1] - domain[0])) * (r1 - r0) + r0
    );
  }

  scale.domain = function (_: any) {
    return arguments.length
      ? ((domain = [+_[0], +_[1]]), scale)
      : domain.slice();
  };

  scale.range = function (_: any) {
    return arguments.length ? ((range = [+_[0], +_[1]]), scale) : range.slice();
  };

  scale.ticks = function (count: any) {
    return d3.scaleLinear().domain(domain).ticks(count);
  };

  scale.tickFormat = function (count: any, specifier: any) {
    return d3.scaleLinear().domain(domain).tickFormat(count, specifier);
  };

  return scale;
}

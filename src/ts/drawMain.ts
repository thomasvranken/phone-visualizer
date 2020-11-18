import * as d3 from "d3";
import $ from "jquery";
import { Graph, svgId } from "./draw";
import { PhoneRepository } from "./repository";
import { TrackedPhone, Phone, OverviewProps } from "./types";
import smartphoneIcon from "../images/icons/smartphone-icon.png";
import cameraIcon from "../images/icons/camera.png";
import batteryIcon from "../images/icons/battery.png";
import cpuIcon from "../images/icons/cpu.png";
import ramIcon from "../images/icons/ram.png";
import storageIcon from "../images/icons/storage.png";

/**
 * The main graph, a radial chart displaying the most important properties.
 */
export class MainGraph extends Graph {
  constructor() {
    super("overzicht", "overzicht");
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
    super.draw(phoneRepo, trackedPhones, containerWidth, containerHeight);
    if (trackedPhones.length === 0) {
      this.drawPlaceSmartphone(svgId);
    } else {
      trackedPhones.forEach((tp) => {
        let phone = phoneRepo.database.find((p) => p.symbolId === tp.id);
        if (phone) {
          this.drawMainGraph(svgId, phone, tp.rect, phoneRepo);
        }
      });
    }
  }

  drawMainGraph(
    svgId: string,
    smartphone: Phone,
    rect: any,
    phoneRepo: PhoneRepository
  ) {
    const svg = d3.select("#" + svgId);

    const innerRadius = 50;
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
      // phoneRepo.minProps.camera,
      56, //TODO better handle lowest camera quality value?
      phoneRepo.maxProps.camera
    );
    let batterySlice = new BatterySlice(
      smartphone.battery.wifi.asHours(),
      // phoneRepo.minProps.battery,
      0,
      phoneRepo.maxProps.battery
    );
    let cpuSlice = new CPUSlice(
      smartphone.cpu.benchmark,
      0,
      phoneRepo.maxProps.cpu
    );
    let ramSlice = new RAMSlice(smartphone.ram, 0, phoneRepo.maxProps.ram);

    let storageSlice = new StorageSlice(
      smartphone.storage,
      0,
      phoneRepo.maxProps.storage
    );

    let slices = [cameraSlice, batterySlice, cpuSlice, ramSlice, storageSlice];
    let priceVal =
      smartphone.price.base.eur + smartphone.price.base.cent * 0.01;
    let generalInfo = {
      brand: smartphone.brand,
      name: smartphone.name,
      price:
        "€" + (Math.round((priceVal + Number.EPSILON) * 100) / 100).toString(),
    };
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
      .attr("stroke", "lightgrey")
      .attr("fill", "none");

    // Draw brand and name
    let textRadius = outerRadius - 20;
    svgGroup
      .append("g")
      .attr("class", "general")
      .selectAll("general")
      .data(Object.values(generalInfo))
      .enter()
      .append("text")
      .text((d) => d)
      .attr("transform", (d) => {
        let res = "translate(0," + -textRadius + ")";
        textRadius -= 30;
        return res;
      })
      .style("text-anchor", "middle")
      .style("text-shadow", "1px 1px 2px black")
      .style("fill", "black");

    // Arc generator used for the different slices
    let arcGenerator: any = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius((slice: any) => {
        let y = d3
          .scaleSqrt()
          .range([innerRadius, outerRadius])
          .domain([slice.min, slice.max]);
        return y(slice.value);
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
      .attr("fill", (s) => s.color)
      .attr("d", arcGenerator as any);

    // Draw icons
    //TODO draw the icons on an imaginary circle around the center
    // (centroid does not give proper result)
    sliceGroup
      .selectAll("image")
      .data(slices)
      .enter()
      .append("image")
      .each(function (s) {
        //Issue: centroid does not actually return coordinates?
        let centroid = arcGenerator.centroid(s);
        let iconLength = 20;
        // let x = centroid[0] + iconLength / 2;
        // let y = centroid[1] + iconLength / 2;
        // let iconRadius = 60;
        // let actualRadius = Math.sqrt(
        //   Math.pow(phoneRelX - x, 2) + Math.pow(phoneRelY - y, 2)
        // );
        // console.log("centroid", centroid[0],centroid[1])
        // console.log("icon pos:", x, y)
        // console.log("actual radius", actualRadius);
        // let scaleFactor = iconRadius / actualRadius;
        // console.log(
        //   "corrected:",
        //   Math.sqrt((phoneAbsX - x) ** 2 + (phoneAbsY - y) ** 2)
        // );
        d3.select(this)
          .attr("xlink:href", s.imageName)
          .attr("x", 0.8 * (centroid[0] - 10))
          .attr("y", 0.8 * (centroid[1] - 10))
          .classed("outline-image", true)
          .style("fill", "black")
          .attr("width", iconLength)
          .attr("height", iconLength);
      });

    // Draw descriptions
    sliceGroup
      .selectAll(".descr")
      .data(slices)
      .enter()
      .each(function (s) {
        let centroid = arcGenerator.centroid(s);
        sliceGroup
          .append("text")
          .classed("descr", true)
          .text(s.getDescription())
          .attr("x", 1.1 * centroid[0])
          .attr("y", 1.1 * centroid[1])
          .style("fill", "black")
          .style("text-anchor", "middle")
          .style("dominant-baseline", "middle");
      });
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
    super("blue", value, min, max, cameraIcon);
  }
}

class BatterySlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super("yellow", value, min, max, batteryIcon);
  }
}

class CPUSlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super("purple", value, min, max, cpuIcon);
  }
}

class RAMSlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super("red", value, min, max, ramIcon);
  }

  getDescription(): string {
    return this.value + " GB";
  }
}

class StorageSlice extends PropertySlice {
  constructor(value: number, min: number, max: number) {
    super("orange", value, min, max, storageIcon);
  }

  getDescription(): string {
    return this.value + " GB";
  }
}

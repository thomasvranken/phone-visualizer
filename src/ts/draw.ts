import * as d3 from "d3";
import { chartId } from "../components/graph/GraphContainer";
import moment, { Duration } from "moment";
import { TrackedPhone, Phone, Price, OverviewProps } from "./types";
import $ from "jquery";
import { PhoneRepository } from "./repository";

export const svgId = "graph-svg";

export class Graph {
  name: string;
  explanation: string;

  constructor(name: string, explanation: string) {
    this.name = name;
    this.explanation = explanation;
  }

  draw(
    phoneRepo: PhoneRepository,
    trackedPhones: Array<TrackedPhone>,
    containerWidth: number,
    containerHeight: number
  ): void {
    console.log("draw super");
    d3.select("#" + chartId + " > *").remove();
    d3.select("#" + chartId)
      .selectAll("*")
      .remove();
    d3.select("#" + chartId)
      .append("svg")
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("id", svgId);
    console.log("draw super complete");
  }
}

type BarChartData = {
  id: number;
  value: number;
};
export class BarChart extends Graph {
  draw(
    phoneRepo: PhoneRepository,
    trackedPhones: Array<TrackedPhone>,
    containerWidth: number,
    containerHeight: number
  ) {
    super.draw(phoneRepo, trackedPhones, containerWidth, containerHeight);
    console.log(trackedPhones.length, containerHeight, containerWidth)
    console.log("draw bar");
    const phones = phoneRepo.database;
    let svg = d3.select("#" + svgId);
    let titlePercent = 0.1;
    let leftPercent = 0.08;
    const ids = trackedPhones.map((tp) => tp.id);
    let data: BarChartData[] = phones
      .map((p) => {
        return { value: this.getChartValue(p), id: p.symbolId };
      })
      .filter((p) => p.value !== undefined) as BarChartData[];
    // console.log("bars for drawing:", data.length)
    data.sort((a, b) => b.value - a.value);
    let marginHorizontal = 5,
      marginVertical = 5;
    let width = containerWidth - marginHorizontal;
    let height = containerHeight - marginVertical;
    let x = d3
      .scaleBand()
      .domain(data.map((d) => d.id.toString())) // What is written on the axis
      .range([leftPercent * width, width]) // Pixel range of the axis
      .padding(0.1);
    // NOTE: x isn't called, so no x-axis is actually drawn
    let y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => this.convertValue(d.value))]) // What is written on the axis
      .range([height, titlePercent * height]); // Pixel range of the axis
    let yAxis = svg
      .append("g")
      .attr("transform", `translate(${leftPercent * width},0)`)
      .call(d3.axisLeft(y));

    // Append a title
    svg
      .append("text")
      .attr("x", "50%")
      .attr("y", ((titlePercent * height) / 3) * 2)
      .style("text-anchor", "middle")
      .style("font-size", 20)
      .text(this.explanation);

    // Draw actual data as bars
    svg
      .selectAll("bar")
      .data(data, (d: any) => d.value)
      .enter()
      .append("rect")
      .attr("x", (d: any) => x(d.id) || 0)
      .attr("y", (d) => y(this.convertValue(d.value)))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => {
        const tracked = trackedPhones.find((tp) => tp.id === d.id);
        if (tracked) {
          return tracked.color;
          // if (ids.includes(d.id)) {
          //   return "red";
        } else return "#808080";
        // if (ids.includes(d.id) && this.allPhonesOnStrip(pairs)) {
        //   return color(d.id);
        // } else return "#808080";
      });

    // Add numerical labels for recognized phones
    svg
      .append("g")
      // .attr("class", "labels")
      .selectAll(".labels")
      .data(data, (d: any) => d.value)
      .enter()
      .append("text")
      .text((d) => {
        return this.convertToText(d.value);
        // if (ids.includes(d.id) && this.allPhonesOnStrip(pairs))
        //     return this.convertToText(d.value)
        // else return ""
      })
      //TODO placement is not completely correct
      .attr("transform", (d: any) => {
        // return `translate(${(x(d.id) || 0) + x.bandwidth() / 2}, ${
        //   y(this.convertValue(d.value)) + ((1 - titlePercent) * height) / 2
        // })`;
        return `translate(${(x(d.id) || 0) + x.bandwidth() / 2}, ${
          y(this.convertValue(d.value)) + 20
        })`;
      })
      .style("text-anchor", "middle")
      // .style("text-shadow", "1px 1px 2px black");
      .style("font-weight", "bold");
    // .style("dominant-baseline", "middle")

    // Change y axis line color
    // yAxis.select(".domain").attr("stroke", "white");
    // yAxis.selectAll(".tick").attr("color", "white");
    yAxis.selectAll(".tick text").attr("font-size", "12");

    // Add y axis title
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", (leftPercent - 0.04) * width)
      .attr("x", -titlePercent * height)
      .attr("font-size", "18");

    // Change all text to black (axis and title)
    svg.selectAll("text").style("fill", "black");
  }

  /**
   * Returns the value of the phone for which
   * the property is being plotted.
   * @param phone
   */
  getChartValue(phone: Phone): number | undefined {
    return undefined;
  }

  /**
   * Returns a converted version of the value, depending on the view.
   * Default implementation is to return the unchanged value.
   * @param {*} value
   */
  convertValue(value: any) {
    return value;
  }

  /**
   * Returns a textual representation of the given value,
   * which is easier to understand for humans.
   * Default implementation is to return the value as a string.
   * @param {*} value
   */
  convertToText(value: any): string {
    return value;
  }
}

export class CameraGeneralChart extends BarChart {
  constructor() {
    super("Algemeen", "Algemene DXO score (dxomark.com)");
  }
  getChartValue(phone: Phone) {
    return phone.camera.dxo.general;
  }
}

export class PhotoChart extends BarChart {
  constructor() {
    super("Foto's", "DXO score voor het nemen van foto's (dxomark.com)");
  }
  getChartValue(phone: Phone) {
    return phone.camera.dxo.photo;
  }
}

export class VideoChart extends BarChart {
  constructor() {
    super("Video's", "DXO score voor het maken van video's (dxomark.com)");
  }
  getChartValue(phone: Phone) {
    return phone.camera.dxo.video;
  }
}

export class BatteryWifiChart extends BarChart {
  constructor() {
    super(
      "Batterij op wifi",
      "Batterijduur bij continu wifigebruik (tweakers.net)"
    );
  }

  getChartValue(phone: Phone) {
    return phone.battery.wifi.asHours();
  }

  convertToText(value: number) {
    const duration = moment.duration(value, "hours");
    return (
      duration.days() * 24 + duration.hours() + "u" + duration.minutes() + "m"
    );
  }
}

export class BasePriceChart extends BarChart {
  constructor() {
    super("Basis", "Basisprijs zonder abonnementen");
  }
  getChartValue(phone: Phone) {
    return phone.price.base.eur + 0.01 * phone.price.base.cent;
  }

  convertToText(value: number) {
    return "€" + (Math.round((value + Number.EPSILON) * 100) / 100).toString();
  }
}

export class WorkingMemoryChart extends BarChart {
  constructor() {
    super("Werkgeheugen", "Werkgeheugen (in Gigabyte)");
  }
  getChartValue(phone: Phone) {
    return phone.memory.ram;
  }
}

export class StorageChart extends BarChart {
  constructor() {
    super("Opslag", "Opslagruimte (in Gigabyte)");
  }
  getChartValue(phone: Phone) {
    return phone.memory.storage;
  }
}

export class CPUPowerChart extends BarChart {
  constructor() {
    super("Rekenkracht", "Rekenkracht");
  }
  getChartValue(phone: Phone) {
    return phone.cpu.benchmark;
  }
}

export class DisplayContrastSunChart extends BarChart {
  constructor() {
    super("Contrast", "Contrast ratio in zonlicht (GSMarena.com)");
  }
  getChartValue(phone: Phone) {
    if (phone.display.contrastSun) {
      return phone.display.contrastSun as number;
    }
    return undefined;
  }
}

import { Graph } from "./draw";
import { PhoneRepository } from "./repository";
import { Phone, TrackedPhone } from "./types";
import * as d3 from "d3";
import { chartId } from "../components/graph/GraphContainer";

export const SPECS_TABLE_CLASS = "specs-table";

class TableEntry {
  constructor(public fieldName: string, public fieldDescription: string) {}
}

/**
 * A class for drawing tabular visualisations
 * of technical phone specifications.
 */
export class TechnicalSpecs extends Graph {
  /**
   * Constructs an object for drawing tables for a given set of specs.
   * @param table A list of TableEntry, each entry has a field name
   * and a longer description.
   * @param superFields A list of fieldnames that have to be traversed
   * in a Phone object to get to certain specs.
   */
  constructor(public table: TableEntry[], public superFields: string[]) {
    super("Specificaties", "Technisch specificaties", "");
  }

  draw(
    phoneRepo: PhoneRepository,
    trackedPhones: Array<TrackedPhone>,
    containerWidth: number,
    containerHeight: number
  ) {
    //   super.draw(phoneRepo, trackedPhones, containerWidth, containerHeight)
    d3.select("#" + chartId + " > *").remove();
    d3.select("#" + chartId)
      .selectAll("*")
      .remove();
    trackedPhones.forEach((tp, i) => {
      let phone = phoneRepo.database.find((p) => p.symbolId === tp.id);
      if (phone) {
        this.drawSpecsTable(phone, tp, this.superFields);
      }
    });
  }

  drawSpecsTable(phone: Phone, tracked: TrackedPhone, superFields: string[]) {
    let specs: any = phone;
    for (let field of superFields) {
      specs = specs[field];
    }
    let specsDiv = d3
      .select("#" + chartId)
      .append("div")
      .classed("specs-div", true);
    // Phone name
    specsDiv
      .append("h6")
      .text(`${phone.brand} ${phone.name}`)
      .style("color", tracked.color)
      .style("text-align", "left");
    let tableElement = specsDiv
      .append("table")
      .attr("id", SPECS_TABLE_CLASS)
      .classed(SPECS_TABLE_CLASS, true);
    // Fill in rows
    let rows = tableElement.selectAll("tr");
    rows
      .data(this.table)
      .enter()
      .append("tr")
      .each(function (entry) {
        let row = d3.select(this);
        let field = entry.fieldName;
        let text: string;
        let color: string = "black";
        if (specs && specs.has(field)) {
          text = specs.get(field).toString();
          if (text.includes("Yes") || text.includes("Ja") || text === "true") {
            color = "green";
            if (text === "true" || text === "Yes") {
              text = "Ja";
            }
          } else if (
            text.includes("No") ||
            text.includes("Nee") ||
            text === "false"
          ) {
            color = "red";
            if (text === "false" || text === "No") {
              text = "Nee";
            }
          }
          row
            .append("td")
            .text(entry.fieldDescription)
            .style("font-size", "12px")
            .style("width", "25%");
          let parts = text.split("\n");
          let details = row.append("td");
          for (let part of parts) {
            details
              .append("p")
              .text(part)
              .classed("specs-p", true)
              .style("font-size", "12px")
              .style("color", color);
          }
        }
      });
  }
}

export class CameraSpecs extends TechnicalSpecs {
  constructor() {
    super(
      [
        new TableEntry("aantalCameras", "Aantal camera's"),
        new TableEntry("achteraan", "Kenmerken achteraan"),
        new TableEntry("featuresAchteraan", "Features achteraan"),
        new TableEntry("videoAchteraan", "Video achteraan"),
        new TableEntry("vooraan", "Kenmerken vooraan"),
        new TableEntry("featuresVooraan", "Features vooraan"),
        new TableEntry("videoVooraan", "Video vooraan"),
      ],
      ["camera", "specs"]
    );
  }
}

export class BatterySpecs extends TechnicalSpecs {
  constructor() {
    super(
      [new TableEntry("type", "Type"), new TableEntry("charging", "Laden")],
      ["battery", "specs"]
    );
  }
}

export class MemorySpecs extends TechnicalSpecs {
  constructor() {
    super(
      [new TableEntry("cardslot", "Ruimte voor externe opslag")],
      ["memory", "specs"]
    );
  }
}

export class CPUSpecs extends TechnicalSpecs {
  constructor() {
    super(
      [
        new TableEntry("processor", "Algemene processor"),
        new TableEntry("gpu", "Grafische processor"),
      ],
      ["cpu", "specs"]
    );
  }
}

export class DisplaySpecs extends TechnicalSpecs {
  constructor() {
    super(
      [
        new TableEntry("type", "Type"),
        new TableEntry("size", "Grootte"),
        new TableEntry("resolution", "Resolutie"),
        new TableEntry("protection", "Bescherming"),
      ],
      ["display", "specs"]
    );
  }
}

export class ConnectivitySpecs extends TechnicalSpecs {
  constructor() {
    super(
      [
        new TableEntry("technology", "Technologieën"),
        new TableEntry("wlan", "WLAN"),
        new TableEntry("bluetooth", "Bluetooth"),
        new TableEntry("gps", "GPS"),
        new TableEntry("nfc", "NFC (Near Field Communicaton)"),
        new TableEntry("radio", "radio"),
        new TableEntry("usb", "USB-poorten"),
      ],
      ["connectivity", "specs"]
    );
  }
}

export class ExtraFeaturesSpecs extends TechnicalSpecs {
  constructor() {
    super(
      [
        new TableEntry("35mm", "3.5mm jack voor audio"),
        new TableEntry("finger", "Vingerafdrukscanner"),
        new TableEntry("accelero", "Accelerometer"),
        new TableEntry("gyro", "Gyroscoop"),
        new TableEntry("proximity", "Nabijheidssensor"),
        new TableEntry("compass", "Kompas"),
        new TableEntry("barometer", "Barometer"),
        new TableEntry("face", "Gezichtsherkenning"),
        new TableEntry("sim", "SIM-kaartslot"),
      ],
      ["features", "specs"]
    );
  }
}

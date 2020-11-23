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
class TechnicalSpecs extends Graph {
  /**
   * Constructs an object for drawing tables for a given set of specs.
   * @param table A list of TableEntry, each entry has a field name
   * and a longer description.
   * @param superFields A list of fieldnames that have to be traversed
   * in a Phone object to get to certain specs.
   */
  constructor(public table: TableEntry[], public superFields: string[]) {
    super("Specificaties", "Technisch specificaties");
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
    specsDiv
      .append("h6")
      .text(`${phone.brand} ${phone.name}`)
      .style("color", tracked.color)
      .style("text-align", "left");
    let tableElement = specsDiv
      .append("table")
      .attr("id", SPECS_TABLE_CLASS)
      .classed(SPECS_TABLE_CLASS, true);
    let rows = tableElement.selectAll("tr");
    rows
      .data(this.table)
      .enter()
      .append("tr")
      .each(function (entry) {
        let row = d3.select(this);
        let field = entry.fieldName;
        if (specs.has(field)) {
          row.append("td").text(entry.fieldDescription);
          let text: any = specs.get(field).toString();
          console.log(text);
          let parts = text.split("\n");
          let details = row.append("td");
          for (let part of parts) {
            details.append("p").text(part).classed("specs-p", true);
          }
          //   row.append("td").text(text);
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
      [
        new TableEntry("type", "Type"),
        new TableEntry("charging", "Laden"),
      ],
      ["battery", "specs"]
    );
  }
}

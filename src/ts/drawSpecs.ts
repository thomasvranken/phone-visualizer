import { Graph } from "./draw";
import { PhoneRepository } from "./repository";
import { Phone, TrackedPhone } from "./types";
import * as d3 from "d3";
import { chartId } from "../components/graph/GraphContainer";

export const SPECS_TABLE_CLASS = "specs-table";

class TableEntry {
  constructor(public fieldName: string, public fieldDescription: string) {}
}

class TechnicalSpecs extends Graph {
  constructor(public table: TableEntry[]) {
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
        this.drawSpecsTable(phone,tp);
      }
    });
  }

  drawSpecsTable(phone: Phone, tracked: TrackedPhone) {
    let specsDiv = d3.select("#" + chartId).append("div").classed("specs-div", true);
    specsDiv
      .append("h6")
      .text(`${phone.brand} ${phone.name}`)
      .style("color", tracked.color)
      .style("text-align", "left")
    //   .attr("alig");
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
        if (phone.camera.specs.has(field)) {
          row.append("td").text(entry.fieldDescription);
          let text: any = phone.camera.specs.get(field);
          row.append("td").text(text);
        }
      });
  }
}

export class CameraSpecs extends TechnicalSpecs {
  constructor() {
    super([
      new TableEntry("features", "Extra features"),
      new TableEntry("aantalAchteraan", "Aantal camera's achteraan"),
      new TableEntry("aantalVooraan", "Aantal camera's vooraan"),
    ]);
  }
}

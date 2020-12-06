import { Card } from "@material-ui/core";
import React from "react";
import { Category, PriceCategory } from "../../ts/category";
import { BarChart } from "../../ts/draw";
import { calcImgHeight, calcImgWidth } from "../../ts/phoneImage";
import { PhoneRepository } from "../../ts/repository";
import { Phone, TrackedPhone } from "../../ts/types";
import "./Suggestions.css";

function Suggestions(props: {
  phoneRepo: PhoneRepository;
  active: Category;
  trackedPhones: TrackedPhone[];
}) {
  let chart = props.active.currentGraph as BarChart;

  /**
   * Returns a list of phones to suggest
   * (one per tracked phone, no duplicates).
   */
  function suggestSimilar() {
    let list: Phone[] = [];
    for (let tp of props.trackedPhones) {
      // Gets phone list sorted on graph property
      let sorted = [...props.phoneRepo.database]
        .filter((p) => {
          return chart.getChartValue(p) !== undefined;
        })
        .sort((a, b) => {
          let va = chart.getChartValue(a) as number;
          let vb = chart.getChartValue(b) as number;
          return va - vb;
        });
      console.log("before",sorted.length);
      // Filter out other tracked phones as possible suggestions
      sorted = sorted.filter(p => {
        for (let tp2 of props.trackedPhones) {
          if (tp2.id !== tp.id && p.symbolId === tp2.id){
            return false;
          }
        }
        return true
      })
      console.log("after",sorted.length);
      let phone = sorted.find((p) => p.symbolId === tp.id);
      if (phone) {
        let index = sorted.indexOf(phone);
        if (index > 0) {
          if (index === sorted.length - 1) {
            // Case 1: phone is at the end of list
            list.push(sorted[index - 1]);
          } else {
            // Case 2: phone is somewhere in the middle of the list
            let left = chart.getChartValue(sorted[index - 1]) as number;
            let right = chart.getChartValue(sorted[index + 1]) as number;
            let val = chart.getChartValue(sorted[index]) as number;
            if (Math.abs(left - val) < Math.abs(right - val)) {
              list.push(sorted[index - 1]);
            } else {
              list.push(sorted[index + 1]);
            }
          }
        } else {
          // Case 3: phone is at the beginning of the list
          list.push(sorted[index + 1]);
        }
      }
    }
    // Filter duplicates
    return list.filter((v, i) => list.indexOf(v) === i);
  }

  function getDescription(phone: Phone): string[] {
    let result: string[] = [];
    result.push(
      `${phone.brand} ${phone.name} (€${phone.price.base.eur},${phone.price.base.cent})`
    );
    if (!(props.active instanceof PriceCategory)) {
      result.push("score: " + chart.convertToText(chart.getChartValue(phone)));
    }
    return result;
  }

  let suggestions = suggestSimilar();
  return (
    <div>
      <h6>Suggesties</h6>
      {suggestions.map((s, i) => (
        <div key={i} className="suggestion">
          <img
            src={"/images/phones/" + s.image}
            height={0.7 * calcImgHeight(s)}
            width={0.7 * calcImgWidth(s)}
            alt=""
            style={{
              transform:"rotate(90deg)"}}
          ></img>
          {getDescription(s).map((d, i) => (
            <p key={i}>{d}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Suggestions;

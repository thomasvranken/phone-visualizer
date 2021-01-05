import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import React from "react";
import { PhoneRepository } from "../../ts/repository";
import { TrackedPhone } from "../../ts/types";

const featuresMap: Map<String, String> = new Map([
  ["35mm", "3.5mm jacket"],
  ["finger", "vingerafdrukscanner"],
  ["accelero", "accelerometer"],
  ["gyro", "gyroscoop"],
  ["proximity", "nabijheidssensor"],
  ["compass", "kompas"],
  ["barometer", "barometer"],
  ["face", "gezichtsherkenning"],
  ["dualSim", "Dual SIM"],
  ["grootteSim", "Grootte SIM-kaart(en)"],
]);

const useStyles = makeStyles({
  container: {
    // maxWidth: "80%",
  },
  table: {
    tableLayout: "fixed",
    borderCollapse: "separate",
    borderSpacing: "10px 0px",
    width: "auto",
    marginTop: "3%"
    // maxWidth: "400px",
  },
  header: {
    maxWidth: 200,
    minWidth: 150,
  },
  cell: {
    textAlign: "center",
    padding: "2px 2px",
    maxWidth: 200,
    width: "auto",
    minWidth: 100,
    color: "black",
    // borderLeft: "1px solid grey",
  },
  colorBlock: {
    height: 40,
    minHeight: 20,
  },
  grey: {
    backgroundColor: "lightgrey",
  },
  green: {
    backgroundColor: "lightgreen",
  },
  red: {
    backgroundColor: "LightCoral",
  },
});

function getColorAndDescr(value: string) {
  let lower = value.toLowerCase();
  if (lower === "true") {
    return ["green", "✔"];
  } else if (lower === "false") {
    return ["red", "╳"];
  } else if (lower.includes("yes,")) {
    return ["green", value];
  } else if (lower.includes("no,")) {
    return ["red", value];
  }
  return null;
}

export function FeaturesTable(props: {
  trackedPhones: TrackedPhone[];
  phoneRepo: PhoneRepository;
}) {
  const classes = useStyles();
  let keys = Array.from(featuresMap.keys());
  return (
    <TableContainer
      style={{
        overflow: "hidden",
      }}
      className={classes.container}
    >
      <Table size="small" className={classes.table}>
        <TableBody>
          {keys.map((key: any) => {
            let description = featuresMap.get(key) as string;
            description =
              description.charAt(0).toUpperCase() + description.slice(1);
            return (
              <TableRow
                style={{
                  margin: 0,
                  padding: 0,
                }}
                key={key}
              >
                <TableCell className={classes.header}>{description}</TableCell>
                {props.trackedPhones.map((tp) => {
                  let phone = props.phoneRepo.findPhone(tp) as any;
                  let value = phone["features"]["specs"].get(key);
                  let cellClasses = [classes.cell];
                  if (value === undefined) {
                    value = "Niet gegeven";
                    cellClasses.push(classes.grey);
                  } else {
                    let colorDescr = getColorAndDescr(value.toString());
                    if (colorDescr !== null) {
                      if (colorDescr[0] === "green") {
                        cellClasses.push(classes.green);
                      } else if (colorDescr[0] === "red") {
                        cellClasses.push(classes.red);
                      }
                      value = colorDescr[1];
                    }
                  }
                  return (
                    <TableCell className={cellClasses.join(" ")} key={tp.id}>
                      {value.toString()}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.colorBlock}></TableCell>
            {props.trackedPhones.map((tp) => {
              return (
                <TableCell
                  style={{ backgroundColor: tp.color }}
                  className={classes.colorBlock}
                  key={tp.id}
                >
                  {" "}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

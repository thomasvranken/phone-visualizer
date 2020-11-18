import { PhoneRepository } from "./repository";

let TuioLib = require("tuio-extended/src/Tuio");
TuioLib.Client = require("tuio-extended/src/TuioClient");
TuioLib.Component = require("tuio-extended/src/TuioClient");
TuioLib.Container = require("tuio-extended/src/TuioContainer");
TuioLib.Cursor = require("tuio-extended/src/TuioCursor");
TuioLib.Object = require("tuio-extended/src/TuioObject");
TuioLib.ObjectContainer = require("tuio-extended/src/TuioObjectContainer");
TuioLib.Point = require("tuio-extended/src/TuioPoint");
TuioLib.Pointer = require("tuio-extended/src/TuioPointer");
TuioLib.Source = require("tuio-extended/src/TuioSource");
TuioLib.Time = require("tuio-extended/src/TuioTime");
TuioLib.Token = require("tuio-extended/src/TuioToken");

class Tuio {
  tuioClient: any;
  repository: PhoneRepository | undefined;
  constructor() {
    console.log("create");
    this.tuioClient = new TuioLib.Client({
      host: "ws://localhost:8080"
    });
    this.tuioClient.on("connect", () =>
      console.log("connected to TUIO server")
    );
    this.tuioClient.on("refresh", () => this.refresh());
    this.tuioClient.connect();
  }

  setRepository(repository: PhoneRepository) {
    this.repository = repository;
  }

  refresh() {
    // let temp = []
    let ids = [];
    let objects = this.tuioClient.getTuioObjects();
    for (let i in objects) {
      const o = objects[i];
      console.log("found object with id", o.getSymbolId());
      ids.push(o.getSymbolId());
      //console.log(screenHeight, o.getY())
      // console.log("object screen pos is", o.getScreenX(screenWidth), o.getScreenY(screenHeight))
      //   try {
      // const smartphone = findPhoneById(o.getSymbolId())
      // temp.push({
      //     tuio: o,
      //     phone: smartphone
      // })
      //   } catch {
      // console.log("Something went wrong while looking for a phone...")
      //   }
    }
    this.repository?.setCurrentIds(ids);
    // buffer.length = 0
    // buffer.push(...temp)
  }
}

export default Tuio;

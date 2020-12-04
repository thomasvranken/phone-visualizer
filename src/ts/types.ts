import moment, { Duration } from "moment";

export type TrackedPhone = {
  id: number;
  rect: any;
  color: string;
};

export type Price = {
  eur: number;
  cent: number;
};

export type Phone = {
  brand: string;
  name: string;
  price: {
    base: Price;
  };
  battery: {
    wifi: Duration;
    video: Duration | undefined;
    specs: Map<string, string>;
  };
  camera: {
    dxo: {
      general: number;
      photo: number;
      video: number;
      approximate: boolean;
    };
    specs: Map<string, string>;
  };
  memory: {
    ram: number;
    storage: number;
    specs: Map<string, string>;
  };
  cpu: {
    benchmark: number;
    specs: Map<string, string>;
  };
  os: {
    type: string;
    version: string;
  };
  display: {
    contrastSun: number | undefined;
    contrastNom: number | undefined;
    maxHelder: number | undefined;
    minHelder: number | undefined;
    specs: Map<string, string>;
  };
  connectivity: {
    specs: Map<string, string>;
  };
  features: {
    specs: Map<string, string>;
  };
  physical: {
    width: number | undefined; // in mm
    height: number | undefined; // in mm
  };
  symbolId: number;
  image?: string;
  inActiveUse: boolean; // true if the phone should be shown in the app as a draggable image
};

export type OverviewPhone = {
  brand: string;
  name: string;
  price: {
    base: Price;
  };
  props: OverviewProps;
};

export type OverviewProps = {
  camera: number;
  battery: number;
  cpu: number;
  ram: number;
  storage: number;
};

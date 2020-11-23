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
  ram: number;
  storage: number;
  cpu: {
    benchmark: number;
  };
  display: {
    contrastSun: number | undefined;
    contrastNom: number | undefined;
  }
  symbolId: number;
  image?: string;
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

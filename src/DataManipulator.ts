import { ServerRespond } from "./DataStreamer";

export interface Row {
  // Definies the structure of the data that will be displayed in the dashboard
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    // This function manipulates the data from the server to the format and values that will be displayed in the dashboard
    const priceABC =
      (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF =
      (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = ratio + (0.1*ratio); // Upper bound of the ratio is 10% higher than the average
    const lowerBound = ratio - (0.1*ratio); // Lower bound of the ratio is 10% lower than the average
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp:
        serverResponds[0].timestamp > serverResponds[1].timestamp
          ? serverResponds[0].timestamp
          : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert:
        ratio > upperBound || ratio < lowerBound ? ratio : undefined,
    };
  }
}

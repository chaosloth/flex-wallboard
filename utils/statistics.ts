import type { TextColor, BackgroundColor } from "@twilio-paste/style-props";
import { MapItem } from "twilio-sync/lib/mapitem";

export interface Metric {
  label: string;
  value: string;
  formula?: string;
  format?: string;
  increment?: boolean;
  defaultStyle?: TileStyle;
  firstThresholdValue?: string;
  secondThresholdStyle?: TileStyle;
  secondThresholdValue?: string;
  firstThresholdStyle?: TileStyle;
  invertThresholds: boolean;
}

export interface TileStyle {
  styleName: string;
  headlineColour: TextColor;
  statColour: TextColor;
  backgroundColour: BackgroundColor;
}

export interface MetricDefinitions {
  [key: string]: {
    metric: Metric;
  };
}

export type StatisticsDocument = {
  queues: any[];
  workspace: any;
};

export default class StatUtil {
  static mapToDocument(data: MapItem[]): StatisticsDocument {
    let stats: StatisticsDocument = {
      queues: [],
      workspace: {},
    };

    data.map((item) => {
      if (item.key === "WORKSPACE") {
        stats.workspace = item.value;
        console.log("Stat Util mapToDocument workspace", item);
      } else {
        stats.queues.push(item.value);
      }
    });

    return stats;
  }

  static fmtSeconds(seconds: number): string {
    try {
      var date = new Date(0);
      date.setSeconds(seconds);
      return date.toISOString().slice(11, -5);
    } catch (err) {
      console.log(`Error formatting value [${seconds}] into seconds`);
      return "ERR FMT";
    }
  }

  static calculate(definitions: MetricDefinitions, data: any): Metric[] {
    let statistics: Metric[] = [];
    for (const [statistic_name, statistic_definition] of Object.entries(
      definitions
    )) {
      let calculatedValue: string | undefined;
      try {
        let func_string =
          "return function(data){ return " +
          statistic_definition.metric.formula +
          " }";
        // console.log("FN:", func_string);
        // console.log(`STAT ${statistic_name} FN: "${func_string}" -- `, data);
        let func = Function(func_string);
        // Calculate value based on formula
        calculatedValue = func()(data);
        console.log(`Statistic [${statistic_name}] = ${calculatedValue}`);
      } catch (err) {
        console.log(`Error calculating stat ${statistic_name}: `, err);
        calculatedValue = "ERR";
      }
      statistic_definition.metric.value =
        calculatedValue === undefined ? "ERR" : calculatedValue;
      statistics.push(statistic_definition.metric);
    }
    return statistics;
  }
}

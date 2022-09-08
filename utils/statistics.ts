import type { TextColor, BackgroundColor } from "@twilio-paste/style-props";

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

export default class StatUtil {
  static fmtSeconds(seconds: number): string {
    try {
      var date = new Date(0);
      date.setSeconds(seconds);
      return date.toISOString().slice(11, -5);
    } catch (err) {
      console.error(`Error formatting value into seconds: ${seconds}: `, err);
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
        let func = Function(func_string);
        // Calculate value based on formula
        calculatedValue = func()(data);
        // console.log("VAL:", calculatedValue);
      } catch (err) {
        console.error(`Error calculating stat ${statistic_name}: `, err);
        calculatedValue = "ERR";
      }
      statistic_definition.metric.value = calculatedValue || "0";
      statistics.push(statistic_definition.metric);
    }
    return statistics;
  }
}

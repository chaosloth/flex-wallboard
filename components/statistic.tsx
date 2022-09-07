import { Card, Text } from "@twilio-paste/core";
import StatUtil, { StatisticType } from "../utils/statistics";

interface StatisticProps {
  stat: StatisticType;
}

export const Statistic: React.FC<StatisticProps> = (props: StatisticProps) => {
  return (
    <Card padding={"space70"} element="METRIC">
      <Text as="div" textAlign={"center"}>
        <Text
          as="h2"
          color="colorTextDecorative10"
          lineHeight={"lineHeight80"}
          fontSize={"fontSize60"}
          fontWeight={"fontWeightLight"}
          marginBottom="space60"
        >
          {props.stat.label}
        </Text>
        <Text
          as="div"
          fontSize="fontSize110"
          fontWeight="fontWeightMedium"
          lineHeight={"lineHeight80"}
        >
          {props.stat.format === "seconds"
            ? StatUtil.fmtSeconds(parseInt(props.stat.value))
            : props.stat.value}
        </Text>
      </Text>
    </Card>
  );
};

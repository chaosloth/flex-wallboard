import { Card, Text } from "@twilio-paste/core";
import { StatisticType } from "../utils/statistics";

export const Statistic: React.FC<StatisticType> = (props: StatisticType) => {
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
          {props.label}
        </Text>
        <Text
          as="div"
          fontSize="fontSize110"
          fontWeight="fontWeightMedium"
          lineHeight={"lineHeight80"}
        >
          {props.value}
        </Text>
      </Text>
    </Card>
  );
};

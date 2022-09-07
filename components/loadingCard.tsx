import { Card, Text, SkeletonLoader } from "@twilio-paste/core";

export const LoadingCard: React.FC = () => {
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
          <SkeletonLoader />
        </Text>
        <Text
          as="div"
          fontSize="fontSize110"
          fontWeight="fontWeightMedium"
          lineHeight={"lineHeight80"}
        >
          <SkeletonLoader />
        </Text>
      </Text>
    </Card>
  );
};

import { Box, Text } from "@twilio-paste/core";

export const Headline: React.FC = () => {
  return (
    <Box
      textAlign={"center"}
      padding="space40"
      backgroundColor="colorBackgroundBodyInverse"
    >
      <Text
        as="h2"
        lineHeight={"lineHeight100"}
        fontSize={"fontSize100"}
        fontWeight={"fontWeightMedium"}
        margin="space70"
        color={"colorTextBrandInverse"}
      >
        Real-time Dashboard
      </Text>
    </Box>
  );
};

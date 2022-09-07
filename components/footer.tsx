import { Box, Text } from "@twilio-paste/core";

export interface FooterProps {
  value: string | undefined;
}

export const Footer: React.FC<FooterProps> = (props: FooterProps) => {
  return (
    <Box
      textAlign={"center"}
      padding="space40"
      backgroundColor="colorBackgroundBodyInverse"
      className="footer"
    >
      <Text
        as="h2"
        lineHeight={"lineHeight60"}
        fontSize={"fontSize60"}
        fontWeight={"fontWeightMedium"}
        color={"colorTextBrandInverse"}
      >
        {props.value}
      </Text>
    </Box>
  );
};

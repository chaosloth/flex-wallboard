import { Box, Text } from "@twilio-paste/core";
import { useEffect, useState } from "react";
import StatUtil, { Metric, TileStyle } from "../utils/statistics";
import ConfigureStat from "./configureStat";
import styles from "../utils/styles";
import React from "react";
interface StatisticProps {
  stat: Metric;
}

export const Statistic: React.FC<StatisticProps> = (props: StatisticProps) => {
  // Modal
  const [isModalOpen, setModalIsOpen] = useState(false);
  const handleModalOpen = () => setModalIsOpen(true);
  const handleModalClose = () => setModalIsOpen(false);

  const [style, setStyle] = React.useState<TileStyle>(
    props.stat.defaultStyle || styles[0]
  );

  // Subscribe to statistic updates
  useEffect(() => {
    console.log("Evaluating metric thresholds");
    let newStyle: TileStyle = style;

    if (props.stat.defaultStyle) newStyle = props.stat.defaultStyle;

    if (!props.stat.invertThresholds) {
      if (
        props.stat.firstThresholdValue &&
        typeof parseInt(props.stat.firstThresholdValue) == "number"
      ) {
        if (props.stat.value > props.stat.firstThresholdValue) {
          if (props.stat.firstThresholdStyle) {
            newStyle = props.stat.firstThresholdStyle;
          }
        }
      }
      if (
        props.stat.secondThresholdValue &&
        typeof parseInt(props.stat.secondThresholdValue) == "number"
      ) {
        if (props.stat.value > props.stat.secondThresholdValue) {
          if (props.stat.secondThresholdStyle) {
            newStyle = props.stat.secondThresholdStyle;
          }
        }
      }
    } else {
      if (
        props.stat.secondThresholdValue &&
        typeof parseInt(props.stat.secondThresholdValue) == "number"
      ) {
        if (props.stat.value < props.stat.secondThresholdValue) {
          if (props.stat.secondThresholdStyle) {
            newStyle = props.stat.secondThresholdStyle;
          }
        }
      }

      if (
        props.stat.firstThresholdValue &&
        typeof parseInt(props.stat.firstThresholdValue) == "number"
      ) {
        if (props.stat.value < props.stat.firstThresholdValue) {
          if (props.stat.firstThresholdStyle) {
            newStyle = props.stat.firstThresholdStyle;
          }
        }
      }
    }
    setStyle(newStyle);
  }, [props.stat.value]);

  return (
    <Box
      padding="space70"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius={"borderRadius20"}
      borderStyle="solid"
      borderColor={"colorBorderWeak"}
      element="METRIC"
      onClick={handleModalOpen}
      backgroundColor={style.backgroundColour}
    >
      <Text as="div" textAlign={"center"}>
        <Text
          as="h2"
          color={style.headlineColour}
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
          color={style.statColour}
        >
          {props.stat.format === "seconds"
            ? StatUtil.fmtSeconds(
                props.stat.value === "-" ? 0 : parseInt(props.stat.value)
              )
            : props.stat.value}
        </Text>
      </Text>

      <ConfigureStat
        handleClose={handleModalClose}
        handleOpen={handleModalOpen}
        isOpen={isModalOpen}
        stat={props.stat}
      />
    </Box>
  );
};

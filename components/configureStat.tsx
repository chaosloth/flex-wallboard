import { useUID } from "@twilio-paste/core/uid-library";
import { Button } from "@twilio-paste/core/button";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  ModalHeader,
  ModalHeading,
} from "@twilio-paste/core/modal";

import {
  Label,
  Select,
  Option,
  Input,
  Column,
  Grid,
  Box,
  Text,
  Separator,
  Spinner,
  TextArea,
  HelpText,
  Switch,
} from "@twilio-paste/core";

import StatUtil, {
  MetricDefinitions,
  Metric,
  TileStyle,
} from "../utils/statistics";

import React from "react";
import styles from "../utils/styles";

interface ConfigureStatProps {
  stat: Metric;
  isOpen: boolean;
  handleOpen: any;
  handleClose: any;
}

const ConfigureStat: React.FC<ConfigureStatProps> = (
  props: ConfigureStatProps
) => {
  const modalHeadingID = useUID();
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<string>();

  const [invertThresholds, setInverted] = React.useState(
    props.stat.invertThresholds
  );

  const [defaultThresholdStyle, setDefaultThresholdStyle] = React.useState<
    TileStyle | undefined
  >(props.stat.defaultStyle);

  const [firstThresholdValue, setFirstThresholdValue] = React.useState<
    string | undefined
  >(props.stat.firstThresholdValue);

  const [firstThresholdStyle, setFirstThresholdStyle] = React.useState<
    TileStyle | undefined
  >(props.stat.firstThresholdStyle);

  const [secondThresholdValue, setSecondThresholdValue] = React.useState<
    string | undefined
  >(props.stat.secondThresholdValue);

  const [secondThresholdStyle, setSecondThresholdStyle] = React.useState<
    TileStyle | undefined
  >(props.stat.secondThresholdStyle);

  const [style, setStyle] = React.useState<TileStyle>(
    props.stat.defaultStyle ? props.stat.defaultStyle : styles[0]
  );

  const handleColourChange = (event: any, target: any) => {
    if (event.target.value) {
      let colour = styles[event.target.value];
      console.log("Changing colour to:", colour);
      setStyle(colour);
      target(colour);
    }
  };

  const handleSaveDefinition = () => {
    setSaving(true);

    let m: Metric = props.stat;

    m.defaultStyle = defaultThresholdStyle;
    m.firstThresholdValue = firstThresholdValue;
    m.firstThresholdStyle = firstThresholdStyle;
    m.secondThresholdValue = secondThresholdValue;
    m.secondThresholdStyle = secondThresholdStyle;
    m.invertThresholds = invertThresholds;

    let definition: MetricDefinitions = {
      [props.stat.label]: {
        metric: m,
      },
    };

    console.log("Definition details", JSON.stringify(definition, null, 3));

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "";

    fetch(`${BASE_URL}/saveDefinition`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(definition),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Saved definition", data);
        props.handleClose();
      })
      .catch((err: any) => {
        console.error("Error saving statistic definition", err);
        setStatus("Error saving statistic definition... " + err.message);
      })
      .finally(() => {
        setSaving(false);
        window.location.reload();
      });
  };

  return (
    <div>
      <Modal
        ariaLabelledby={modalHeadingID}
        isOpen={props.isOpen}
        onDismiss={props.handleClose}
        size="wide"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            {props.stat.label}
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Grid gutter="space50">
            <Column>
              <Label htmlFor="default_style">Default style</Label>
              <Select
                id="default_style"
                onChange={(event) => {
                  handleColourChange(event, setDefaultThresholdStyle);
                }}
              >
                {styles.map((colour: TileStyle, i: number) => (
                  <Option
                    key={i}
                    value={i + ""}
                    selected={
                      colour.styleName === props.stat.defaultStyle?.styleName
                    }
                  >
                    {colour.styleName}
                  </Option>
                ))}
              </Select>

              <Separator orientation={"horizontal"} verticalSpacing="space50" />

              <Label htmlFor="threshold_1_value">
                When statistic is
                {invertThresholds ? " less than" : " greater than"}:
              </Label>
              <Input
                id="threshold_1_value"
                name="threshold_1_value"
                type="text"
                placeholder="Threshold value"
                onChange={(event) => setFirstThresholdValue(event.target.value)}
                value={firstThresholdValue}
              />

              <Label htmlFor="threshold_1_style">Show this colour</Label>
              <Select
                id="threshold_1_style"
                onChange={(event) => {
                  handleColourChange(event, setFirstThresholdStyle);
                }}
              >
                {styles.map((colour: TileStyle, i: number) => (
                  <Option
                    key={i}
                    value={i + ""}
                    selected={
                      colour.styleName === firstThresholdStyle?.styleName
                    }
                  >
                    {colour.styleName}
                  </Option>
                ))}
              </Select>

              <Separator orientation={"horizontal"} verticalSpacing="space50" />

              <Label htmlFor="threshold_2_value">
                When statistic is
                {invertThresholds ? " less than" : " greater than"}:
              </Label>
              <Input
                id="threshold_2_value"
                name="threshold_2_value"
                type="text"
                placeholder="Threshold value"
                onChange={(event) =>
                  setSecondThresholdValue(event.target.value)
                }
                value={secondThresholdValue}
              />

              <Label htmlFor="threshold_2_style">Show this colour</Label>
              <Select
                id="threshold_2_style"
                onChange={(event) => {
                  handleColourChange(event, setSecondThresholdStyle);
                }}
              >
                {styles.map((colour: TileStyle, i: number) => (
                  <Option
                    key={i}
                    value={i + ""}
                    selected={
                      colour.styleName === secondThresholdStyle?.styleName
                    }
                  >
                    {colour.styleName}
                  </Option>
                ))}
              </Select>

              <Separator orientation={"horizontal"} verticalSpacing="space50" />

              <Switch
                checked={invertThresholds}
                onChange={() => setInverted(!invertThresholds)}
              >
                Invert threshold evaluation
              </Switch>
            </Column>
            <Column>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  backgroundColor={style.backgroundColour}
                  padding="space100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius={"borderRadius20"}
                  borderStyle="solid"
                  borderColor={"colorBorder"}
                  element="METRIC"
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
                      color={style.statColour}
                      fontSize="fontSize110"
                      fontWeight="fontWeightMedium"
                      lineHeight={"lineHeight80"}
                    >
                      {props.stat.format === "seconds"
                        ? StatUtil.fmtSeconds(parseInt(props.stat.value))
                        : props.stat.value}
                    </Text>
                  </Text>
                </Box>
              </Box>

              <Separator orientation={"horizontal"} verticalSpacing="space50" />

              <Label htmlFor="message">Formula</Label>
              <TextArea
                value={props.stat.formula}
                onChange={() => {}}
                aria-describedby="formula_help_text"
                id="formula"
                name="formula"
                required
              />
              <HelpText id="formula_help_text">
                ECMA script manipulation of Task Router metrics. Edit the
                definition in the Twilio Console.
              </HelpText>
            </Column>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>
            <Text as="p">{status}</Text>
            <Button
              variant="secondary"
              onClick={props.handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveDefinition}
              disabled={saving}
            >
              {saving && <Spinner decorative={true} />}
              Save
            </Button>
          </ModalFooterActions>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ConfigureStat;

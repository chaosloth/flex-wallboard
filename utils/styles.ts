import { TileStyle } from "./statistics";

const styles: TileStyle[] = [];

styles[0] = {
  styleName: "Default",
  headlineColour: "colorTextDecorative10",
  statColour: "colorText",
  backgroundColour: "transparent",
};

styles[1] = {
  styleName: "Success",
  headlineColour: "colorTextIconSuccess",
  statColour: "colorTextIconSuccess",
  backgroundColour: "transparent",
};

styles[2] = {
  styleName: "Warn",
  headlineColour: "colorTextWarning",
  statColour: "colorTextWarning",
  backgroundColour: "transparent",
};

styles[3] = {
  styleName: "Error",
  headlineColour: "colorTextIconError",
  statColour: "colorTextIconError",
  backgroundColour: "transparent",
};

styles[4] = {
  styleName: "Success Strong",
  headlineColour: "colorTextInverse",
  statColour: "colorTextInverse",
  backgroundColour: "colorBackgroundSuccess",
};

styles[5] = {
  styleName: "Warn Strong",
  headlineColour: "colorTextInverse",
  statColour: "colorTextInverse",
  backgroundColour: "colorBackgroundWarning",
};

styles[6] = {
  styleName: "Error Strong",
  headlineColour: "colorTextInverse",
  statColour: "colorTextInverse",
  backgroundColour: "colorBackgroundError",
};

export default styles;

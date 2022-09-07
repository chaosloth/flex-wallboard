import "../styles.css";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { CustomizationProvider } from "@twilio-paste/core/customization";

const FlexWallboard: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <CustomizationProvider
      baseTheme="default"
      theme={{
        fonts: {},
        textColors: {},
      }}
    >
      <Component {...pageProps} />
    </CustomizationProvider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  console.log(metric);
}

export default FlexWallboard;

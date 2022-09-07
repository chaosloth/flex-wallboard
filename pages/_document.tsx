import { Html, Head, Main, NextScript } from "next/document";

const Document: React.FC = () => {
  return (
    <Html style={{ height: "100%" }} lang="en">
      <Head>
        <link
          rel="preconnect"
          href="https://assets.twilio.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://assets.twilio.com/public_assets/paste-fonts/main-1.2.0/fonts.css"
        />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="google" content="notranslate" />
      </Head>
      <body style={{ height: "100%" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;

import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Column, Grid } from "@twilio-paste/core";

import { Box } from "@twilio-paste/core/box";
import { Statistic } from "../components/statistic";
import { Headline } from "../components/headline";
import { Footer } from "../components/footer";

import SyncClient from "twilio-sync";
import StatUtil from "../utils/statistics";
import { LoadingCard } from "../components/loadingCard";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>();
  const [status, setStatus] = useState<string>();
  const [client, setClient] = useState<SyncClient>();

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "";

  // Helper method to get an access token
  const getToken = () =>
    fetch(`${BASE_URL}/syncToken`)
      .then((response) => response.json())
      .then((data) => {
        setStatus("Got access token");
        // Create Twilio Sync client with newly received token
        return data.token;
      })
      .catch((reason: any) => {
        setStatus("Could not fetch token");
        console.error("Error getting token", reason);
      });

  // Create sync client and logic for token refresh
  useEffect(() => {
    (async () => {
      console.log("Fetching access token");
      setStatus("Fetching access token");
      // Get a new token on load
      let token = await getToken();

      console.log("Creating new sync client");
      setStatus("Creating new sync client");
      let client = new SyncClient(token);

      client.on("tokenAboutToExpire", async () => {
        console.log("Updating token for sync client");
        setStatus("Fetching new access token");
        const token = await getToken();
        client.updateToken(token);
        setStatus("Updated access token");
      });
      setClient(client);
    })();

    return () => {
      if (client) {
        console.log("Shutting down sync client");
        setStatus("Shutting down sync client");
        client.shutdown();
        setClient(undefined);
      }
    };
  }, []);

  // Subscribe to updates
  useEffect(() => {
    if (client != null) {
      // Create a subscription to the document
      client
        .document(process.env.NEXT_PUBLIC_STAT_DOCUMENT_NAME)
        .then((doc) => {
          console.log("Sync doc updated", doc.value);
          let stats = StatUtil.parse(doc.value);
          setData(stats);
          setLoading(false);
          setStatus("Updated " + new Date().toTimeString());

          doc.on("updated", (event) => {
            console.log("Sync doc updated", doc.value);
            let stats = StatUtil.parse(event.value);
            console.log("Got stats", stats);
            setData(stats);
            setStatus("Last update " + new Date().toTimeString());
          });
        });
    }
  }, [client]);

  let loader = [1, 2, 3, 4, 5, 6];

  return (
    <>
      <Head>
        <title>Flex Wallboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Headline />

      <Box as="main" padding="space30">
        <Grid
          gutter={["space20", "space60", "space90"]}
          vertical={[true, true, false]}
          element="STATGRID"
        >
          {loading &&
            loader.map((i) => (
              <Column key={i} span={4} element="STAT">
                <LoadingCard />
              </Column>
            ))}

          {data &&
            data.map((item: { label: string; value: string }, i: number) => (
              <Column key={i} span={4} element="STAT">
                <Statistic label={item.label} value={item.value} />
              </Column>
            ))}
        </Grid>
      </Box>

      <Footer value={status} />
    </>
  );
};

export default Home;

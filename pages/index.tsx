import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { Column, Grid } from "@twilio-paste/core";

import { Box } from "@twilio-paste/core/box";
import { Statistic } from "../components/statistic";
import { Headline } from "../components/headline";
import { Footer } from "../components/footer";

import SyncClient from "twilio-sync";
import StatUtil, { Metric, MetricDefinitions } from "../utils/statistics";
import { LoadingCard } from "../components/loadingCard";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>();
  const [status, setStatus] = useState<string>();
  const [client, setClient] = useState<SyncClient>();
  const [token, setToken] = useState<string>();
  const [definitions, setDefinitions] = useState<MetricDefinitions>();

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

  const processStats = (definitions: MetricDefinitions, data: any) => {
    if (!definitions) {
      console.warn("Received stat data but definitions not set");
      setStatus("Received stat data but definitions not set");
      return;
    }
    let stats = StatUtil.calculate(definitions, data);
    console.log("Got stats", stats);
    setData(stats);
    setStatus("Last activity " + new Date().toTimeString());
    setLoading(false);
  };

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
        let client = new SyncClient(token);
        // client.updateToken(token);
        setToken(token);
        setClient(client);
        setStatus("Updated access token");
        console.log("Updated access token");
      });
      setClient(client);
      setToken(token);
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

  // Get stats and definitions
  useEffect(() => {
    if (client != null) {
      // Create a subscription to the document
      client
        .document(process.env.NEXT_PUBLIC_DEFINITIONS_DOCUMENT_NAME)
        .then((doc) => {
          console.log("SYNC definitions doc updated", doc.value);
          setDefinitions(doc.value as MetricDefinitions);
          doc.on("updated", (event) => {
            console.log("SYNC definitions doc updated", event.value);
            setDefinitions(event.value);
            setStatus("Last activity " + new Date().toTimeString());
          });
        });
    }
  }, [client, token]);

  // Subscribe to statistic updates
  useEffect(() => {
    if (client != null) {
      // Get the statistics document
      client
        .document(process.env.NEXT_PUBLIC_STAT_DOCUMENT_NAME)
        .then((doc) => {
          if (!definitions) {
            console.warn("Received stats but definitions not set");
            setStatus("Received stats but definitions not set");
            return;
          }
          // Show stats based on initial data
          processStats(definitions, doc.value);
          // Create a subscription to statistics
          doc.on("updated", (event) => processStats(definitions, event.value));
        });
    }
  }, [client, token, definitions]);

  // Increment stat counters
  useEffect(() => {
    const id = setInterval(() => {
      if (!data) return;

      // Increment
      let newData: Metric[] = [];
      data.forEach((stat: Metric) => {
        if (stat.increment) {
          // stat.value = parseInt(stat.value).toString();
          if (parseInt(stat.value) > 0) stat.value = stat.value + 1;
        }
        newData.push(stat);
        setData(newData);
        // return newData;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  });

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
            data.map((item: Metric, i: number) => (
              <Column key={i} span={4} element="STAT">
                <Statistic stat={item} />
              </Column>
            ))}
        </Grid>
      </Box>

      <Footer value={status} />
    </>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import type { NextPage } from 'next';
import { Column, Grid } from '@twilio-paste/core';

import { Box } from '@twilio-paste/core/box';
import { Statistic } from '../components/statistic';
import { Headline } from '../components/headline';
import { Footer } from '../components/footer';

import { SyncClient } from 'twilio-sync';
import StatUtil, { Metric, MetricDefinitions } from '../utils/statistics';
import { LoadingCard } from '../components/loadingCard';

type TaskrouterData = { queues: any[]; workspace: {} };

const Home: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TaskrouterData>();
  const [statistics, setStatistics] = useState<Metric[]>([]);
  const [status, setStatus] = useState<string>();
  const [client, setClient] = useState<SyncClient>();
  const [token, setToken] = useState<string>();
  const [definitions, setDefinitions] = useState<MetricDefinitions>();

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE || '';

  // Helper method to get an access token
  const getToken = () =>
    fetch(`${BASE_URL}/api/token`)
      .then((response) => response.json())
      .then((data) => {
        setStatus('Got access token');
        // Create Twilio Sync client with newly received token
        return data.token;
      })
      .catch((reason: any) => {
        setStatus('Could not fetch token');
        console.error('Error getting token', reason);
      });

  // Create sync client and logic for token refresh
  useEffect(() => {
    (async () => {
      console.log('Fetching access token');
      setStatus('Fetching access token');

      try {
        // Get a new token on load
        let token = await getToken();

        console.log('Creating new sync client');
        setStatus('Creating new sync client');

        let client = new SyncClient(token);
        setClient(client);

        client.on('tokenAboutToExpire', async () => {
          console.log('tokenAboutToExpire - Updating token for sync client');
          setStatus('Fetching new access token');
          const token = await getToken();
          client.updateToken(token);
          setToken(token);
          setClient(client);
          setStatus('tokenAboutToExpire - Updated access token');
          console.log('Updated access token');
        });

        client.on('tokenExpired', async () => {
          console.log('tokenExpired - Updating token for sync client');
          setStatus('Fetching new access token');
          const token = await getToken();
          client.updateToken(token);
          setToken(token);
          setClient(client);
          setStatus('Updated expired access token');
          console.log('tokenExpired - Updated access token');
        });

        client.on('connectionError', async (connectionError) => {
          console.log('Sync Client Connection error', connectionError);
          setStatus('Sync Client Connection error - Check logs');
        });

        client.on('connectionStateChanged', async (newState) => {
          console.log('Sync Connection State', newState);
          setStatus(`Sync Client Connection State Changed [${newState}]`);
        });
      } catch (err) {
        setStatus('Error creating sync client. Check logs');
        console.error(err);
      }

      setToken(token);
    })();

    return () => {
      if (client) {
        console.log('Shutting down sync client');
        setStatus('Shutting down sync client');
        client.shutdown();
        setClient(undefined);
      }
    };
  }, []);

  // Get stats and definitions
  useEffect(() => {
    if (client != null) {
      // Create a subscription to the document
      client.document(process.env.NEXT_PUBLIC_DEFINITIONS_DOCUMENT_NAME).then((doc) => {
        console.log('SYNC definitions doc retrieved', doc.data);
        setDefinitions(doc.data as MetricDefinitions);
        doc.on('updated', (event) => {
          console.log('SYNC definitions doc updated', event.data);
          setDefinitions(event.data);
          setStatus('Last activity ' + new Date().toTimeString());
        });
      });
    }
  }, [client, token]);

  // Subscribe to statistic updates
  useEffect(() => {
    if (!definitions) return;
    if (!client) return;

    // Get the statistics document
    console.log(`Subscribing to sync map: ${process.env.NEXT_PUBLIC_DASHBOARD_SYNC_MAP_SID}`);

    // Update statistic
    const incrementalUpdateData = (item: any) => {
      return setData((data) => {
        if (!data) data = { queues: [], workspace: {} };
        if (item.key === 'WORKSPACE') {
          data.workspace = item.data;
        } else {
          const idx = data.queues.findIndex((q) => q.sid == (item.data as any).sid);
          idx >= 0 ? (data.queues[idx] = item.data) : data.queues.push(item.data);
          console.log(`Index for ${item.key} is ${idx}`);
        }
        setStatus('Last activity ' + new Date().toTimeString());
        return data;
      });
    };

    client.map(process.env.NEXT_PUBLIC_DASHBOARD_SYNC_MAP_SID).then((map) => {
      if (!definitions) {
        console.warn('Received stats but definitions not set');
        setStatus('Received stats but definitions not set');
        return;
      }

      map.getItems().then((mapData) => {
        mapData.items.map((item) => incrementalUpdateData(item));
      });

      // Create a subscription to statistics
      map.on('itemUpdated', (event) => incrementalUpdateData(event.item));
    });
  }, [client, token, definitions]);

  useEffect(() => {
    console.log('Data updated', data);
  }, [data?.queues, data?.workspace]);

  // Update metrics when data changes
  useEffect(() => {
    if (!definitions) {
      console.warn('Received stat data but definitions not set');
      setStatus('Received stat data but definitions not set');
      return;
    }
    let stats = StatUtil.calculate(definitions, data);
    console.log('Got stats', stats);
    setStatistics(stats);
    setStatus('Last activity ' + new Date().toTimeString());
    setLoading(false);
  }, [data?.queues, data?.workspace]);

  // Increment stat counters
  useEffect(() => {
    const id = setInterval(() => {
      if (!statistics) return;

      // Increment
      let newData: Metric[] = [];
      statistics.forEach((stat: Metric) => {
        if (stat.increment) {
          // stat.value = parseInt(stat.value).toString();
          if (parseInt(stat.value) > 0) stat.value = stat.value + 1;
        }
        newData.push(stat);
        setStatistics(newData);
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
        <Grid gutter={['space20', 'space60', 'space90']} vertical={[true, true, false]} element="STATGRID">
          {loading &&
            loader.map((i) => (
              <Column key={i} span={4} element="STAT">
                <LoadingCard />
              </Column>
            ))}

          {statistics &&
            statistics.map((item: Metric, i: number) => (
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

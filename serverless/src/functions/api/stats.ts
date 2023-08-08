// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  ServerlessCallback,
  ServerlessEventObject,
  ServerlessFunctionSignature,
  TwilioClient,
} from "@twilio-labs/serverless-runtime-types/types";

export type MyContext = {
  TWILIO_ACCOUNT_SID: string;
  ACCOUNT_SID: string;
  TWILIO_API_KEY: string;
  TWILIO_API_SECRET: string;
  DASHBOARD_SYNC_SERVICE_SID: string;
  DASHBOARD_SYNC_MAP_SID: string;
  DEFINITIONS_DOCUMENT_NAME: string;
  DASHBOARD_TIMEZONE: string;
  TWILIO_WORKSPACE_SID: string;
  DOCUMENT_NAME: string;
};

export type MyEvent = {} & ServerlessEventObject;

const updateSyncMap = async (
  client: TwilioClient,
  context: MyContext,
  friendlyName: string,
  sid: string,
  data: any,
  isWorkspace: boolean = false
) => {
  const mapEntryName = isWorkspace ? "WORKSPACE" : "TASK_QUEUE_" + sid;

  // Store in Sync and return response
  return client.sync
    .services(context.DASHBOARD_SYNC_SERVICE_SID)
    .syncMaps(context.DASHBOARD_SYNC_MAP_SID)
    .syncMapItems(mapEntryName)
    .update({ data: data })
    .then((data) => {
      console.log(`Updated sync map for ${friendlyName} [${sid}]:`);
    })
    .catch((err) => {
      console.log(`Error updating sync doc for queue ${friendlyName} [${sid}]`);
      if (err.code === 20404) {
        console.log(
          `Task queue map item does not existing, creating ${friendlyName} [${sid}]`
        );
        return client.sync
          .services(context.DASHBOARD_SYNC_SERVICE_SID)
          .syncMaps(context.DASHBOARD_SYNC_MAP_SID)
          .syncMapItems.create({
            key: mapEntryName,
            data: data,
          })
          .then(() =>
            console.log(`Created sync map for ${friendlyName} ${sid}`)
          )
          .catch((err2) =>
            console.log(
              `Error creating new sync map item ${friendlyName} [${sid}]`,
              err2
            )
          );
      }
    })
    .finally(() => console.log(`Completed data fetch for ${friendlyName}`));
};

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (
  context,
  event,
  callback: ServerlessCallback
) => {
  console.log("event received - /api/stats: ", event);

  const client = context.getTwilioClient();

  let response = new Twilio.Response();

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  response.appendHeader(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type,Accept"
  );
  response.appendHeader("Content-Type", "application/json");
  response.setBody("updated");

  let moment = require("moment-timezone");
  let endDate = moment().tz(context.DASHBOARD_TIMEZONE).toDate();
  let endHour = moment().tz(context.DASHBOARD_TIMEZONE).hour();

  var startDate;
  if (endHour >= 6) {
    console.log("late");
    startDate = moment()
      .tz(context.DASHBOARD_TIMEZONE)
      .hour(6)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
  } else {
    console.log("early");
    startDate = moment()
      .tz(context.DASHBOARD_TIMEZONE)
      .hour(6)
      .minute(0)
      .second(0)
      .millisecond(0)
      .subtract(1, "days")
      .toDate();
  }

  let allPromises = [];

  console.log("Getting Task Queue Statistics");

  let taskQueues = await client.taskrouter.v1
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .taskQueues.list({ limit: 20 });

  // console.log("Task Queues", taskQueues);

  taskQueues.forEach(async (t) => {
    console.log(`Creating promise for ${t.friendlyName}`);
    allPromises.push(
      client.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .taskQueues(t.sid)
        .statistics(t.sid)
        .fetch({
          startDate: startDate,
          endDate: endDate,
        })
        .then((queueStats) => {
          let queueData = {
            sid: t.sid,
            friendlyName: t.friendlyName,
            targetWorkers: t.targetWorkers,
            assignmentActivityName: t.assignmentActivityName,
            taskOrder: t.taskOrder,
            data: queueStats,
          };

          return updateSyncMap(
            client,
            context,
            t.friendlyName,
            t.sid,
            queueData
          ).catch((err) => console.log("Error storing stats"));
        })
    );
  });

  // Add Workspace statistics to promises
  allPromises.push(
    client.taskrouter
      .workspaces(context.TWILIO_WORKSPACE_SID)
      .statistics(context.TWILIO_WORKSPACE_SID)
      .fetch({
        startDate: startDate,
        endDate: endDate,
      })
      .then((workspace_data) => {
        console.log("Completed retrieval of Workspace Statistics");

        return updateSyncMap(
          client,
          context,
          "WORKSPACE",
          context.TWILIO_WORKSPACE_SID,
          workspace_data,
          true
        ).catch((err) => console.log("Error storing workspace stats"));
      })
  );

  Promise.all(allPromises)
    .then(() => {
      console.log("All Task Queue statistics complete");
      callback(null, { status: "complete" });
    })
    .catch((e) => {
      console.log("Error in promises", e);
      callback(null, { status: "error" });
    });
};

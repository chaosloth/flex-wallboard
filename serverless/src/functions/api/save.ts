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
  DASHBOARD_SYNC_SERVICE_SID: string;
  DEFINITIONS_DOCUMENT_NAME: string;
};

export type MyEvent = {} & ServerlessEventObject;

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (
  context,
  event,
  callback: ServerlessCallback
) => {
  console.log("event received - /api/save: ", event);

  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

  const client = context.getTwilioClient();

  client.sync
    .services(context.DASHBOARD_SYNC_SERVICE_SID)
    .documents(context.DEFINITIONS_DOCUMENT_NAME)
    .fetch()
    .then((document) => {
      console.log("Statistic Definitions", document);
      let updated_doc = document.data;

      // Insert statistic definition
      for (let k in event) {
        if (k !== "request") updated_doc[k] = event[k];
      }

      client.sync
        .services(context.DASHBOARD_SYNC_SERVICE_SID)
        .documents(context.DEFINITIONS_DOCUMENT_NAME)
        .update({ data: updated_doc })
        .then((document) => {
          response.setBody(document.data);
          callback(null, response);
        })
        .catch((err) => {
          console.error("Error", err);
          callback(err, null);
        });
    })
    .catch((err) => {
      console.error("Error", err);
      callback(err, null);
    });
};

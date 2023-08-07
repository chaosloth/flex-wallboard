// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  ServerlessCallback,
  ServerlessEventObject,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

export type MyContext = {
  TWILIO_ACCOUNT_SID: string;
  ACCOUNT_SID: string;
  TWILIO_API_KEY: string;
  TWILIO_API_SECRET: string;
  DASHBOARD_SYNC_SERVICE_SID: string;
  DEFINITIONS_DOCUMENT_NAME: string;
};

export type MyEvent = {} & ServerlessEventObject;

export const handler: ServerlessFunctionSignature<MyContext, MyEvent> = async (
  context,
  event,
  callback: ServerlessCallback
) => {
  console.log("event received - /api/definitions: ", event);

  const client = context.getTwilioClient();

  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

  client.sync
    .services(context.DASHBOARD_SYNC_SERVICE_SID)
    .documents(context.DEFINITIONS_DOCUMENT_NAME)
    .fetch()
    .then((document) => callback(null, document.data))
    .catch((err) => {
      console.error("Error", err);
      callback(err, null);
    });
};

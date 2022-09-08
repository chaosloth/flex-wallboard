exports.handler = function (context, event, callback) {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Your Account Sid and Auth Token from twilio.com/console
  // DANGER! This is insecure. See http://twil.io/secure
  const accountSid = context.ACCOUNT_SID;
  const authToken = context.AUTH_TOKEN;

  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");

  console.log("ORIG Event", event);

  const client = require("twilio")(accountSid, authToken);

  client.sync
    .services(context.DASHBOARD_SYNC_SERVICE_SID)
    .documents(context.DEFINITIONS_DOCUMENT_NAME)
    .fetch()
    .then((document) => {
      console.log("Statistic Definitions", document);
      let updated_doc = document.data;

      // Insert statistic definition
      for (k in event) {
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

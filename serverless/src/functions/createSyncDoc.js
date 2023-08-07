exports.handler = function (context, event, callback) {
  // Download the helper library from https://www.twilio.com/docs/node/install
  // Your Account Sid and Auth Token from twilio.com/console
  // DANGER! This is insecure. See http://twil.io/secure
  const accountSid = context.ACCOUNT_SID;
  const authToken = context.AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);

  client.sync
    .services(context.DASHBOARD_SYNC_SERVICE_SID)
    .documents.create({
      uniqueName: "dashboardStats",
    })
    .then((document) => callback(null, document.sid));
};

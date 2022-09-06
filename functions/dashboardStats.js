exports.handler = function (context, event, callback) {
  const accountSid = context.ACCOUNT_SID;
  const authToken = context.AUTH_TOKEN;
  const client = require("twilio")(accountSid, authToken);
  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  response.appendHeader(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type,Accept"
  );
  response.appendHeader("Content-Type", "application/json");
  response.setBody("updated");

  var moment = require("moment-timezone");
  var endDate = moment().tz("Australia/Darwin").toDate();
  var endHour = moment().tz("Australia/Darwin").hour();

  var startDate;
  if (endHour >= 6) {
    console.log("late");
    startDate = moment()
      .tz("Australia/Darwin")
      .hour(6)
      .minute(0)
      .second(0)
      .millisecond(0)
      .toDate();
  } else {
    startDate = moment()
      .tz("Australia/Darwin")
      .hour(6)
      .minute(0)
      .second(0)
      .millisecond(0)
      .subtract(1, "days")
      .toDate();
    console.log("early");
  }

  client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .statistics()
    .fetch({
      startDate: startDate,
      endDate: endDate,
    })
    .then((workspace_statistics) =>
      client.sync
        .services(context.DASHBOARD_SYNC_SERVICE_SID)
        .documents("dashboardStats")
        .update({ data: { workspace_statistics } })
        .then((document) => callback(null, response))
    );
};

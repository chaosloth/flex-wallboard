exports.handler = async function (context, event, callback) {
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

  let data = {};
  let allTaskQueuePromises = [];

  console.log("Getting Task Queue Statistics");

  let taskQueues = await client.taskrouter.v1
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .taskQueues.list({ limit: 10 });

  // console.log("Task Queues", taskQueues);

  taskQueues.forEach(async (t) => {
    console.log(`Creating promise for ${t.friendlyName}`);
    allTaskQueuePromises.push(
      client.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .taskQueues(t.sid)
        .statistics()
        .fetch({
          startDate: startDate,
          endDate: endDate,
        })
        .then((queueStats) => {
          let queue = {
            sid: t.sid,
            friendlyName: t.friendlyName,
            targetWorkers: t.targetWorkers,
            assignmentActivityName: t.assignmentActivityName,
            taskOrder: t.taskOrder,
          };

          queue.data = queueStats;
          return queue;
        })
    );
  });

  Promise.all(allTaskQueuePromises)
    .then(async (values) => {
      data.queues = values;
      console.log("All Task Queue statistics complete");
      client.taskrouter
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .statistics()
        .fetch({
          startDate: startDate,
          endDate: endDate,
        })
        .then((workspace_data) => {
          data.workspace = workspace_data;
          console.log("Retrieved Workspace Statistics");

          // Store in Sync and return response
          client.sync
            .services(context.DASHBOARD_SYNC_SERVICE_SID)
            .documents(context.DOCUMENT_NAME)
            .update({ data: data })
            .then((document) => {
              console.log(data);
              console.log("End of Execution");
              callback(null, response);
            });
        });
    })
    .catch((e) => {
      console.log("Error in promises", e);
      callback(null, { status: "error" });
    });
};

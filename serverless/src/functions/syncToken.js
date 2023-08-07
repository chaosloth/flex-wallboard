exports.handler = function (context, event, callback) {
  // make sure you enable ACCOUNT_SID and AUTH_TOKEN in Functions/Configuration
  const ACCOUNT_SID = context.TWILIO_ACCOUNT_SID || context.ACCOUNT_SID;

  const SERVICE_SID = context.DASHBOARD_SYNC_SERVICE_SID;
  const API_KEY = context.TWILIO_API_KEY;
  const API_SECRET = context.TWILIO_API_SECRET;

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // REMINDER: This identity is only for prototyping purposes
  const IDENTITY = makeid(12);

  const AccessToken = Twilio.jwt.AccessToken;
  const SyncGrant = AccessToken.SyncGrant;

  const syncGrant = new SyncGrant({
    serviceSid: SERVICE_SID,
  });

  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY, API_SECRET);

  accessToken.addGrant(syncGrant);
  accessToken.identity = IDENTITY;

  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  response.appendHeader(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type,Accept"
  );
  response.appendHeader("Content-Type", "application/json");
  response.setBody({ token: accessToken.toJwt() });
  console.log(response.body);
  callback(null, response);
};

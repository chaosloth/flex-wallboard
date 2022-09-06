# Flex Wallboard

Simple UI to show basic wallboard stats.

Stats are stored in a SYNC document to which all clients are subscribed by the sync client API. Each time /dashboardStats function is called the latest Task Router statistics are pulled and placed into the document.

## Building

This is a Twilio Serverless project, run `yarn build` to create a new build which will put files into the `assets` folder
See `package.json` for script details, note the build task moves the build folder to assets

## Installation (Twilio Configuration)

1. Create Twilio API key
2. Create new Sync Service (or use default)
3. Create new Sync document in above service called `dashboardStats` (see: `functions/dashboardStat.js` for name)
4. Update `.env` file with API Key, Auth token, Task Router workspace and Sync doc
5. Run `yarn build` to create new build
6. Execute one of the following commands depending on your environment
   6.1 Run `twilio serverless:deploy --env=.env.development` to create new service and deploy the functions and assets
   6.2 Run `twilio serverless:deploy --env=.env.uat --environment=uat` to create new service and deploy the functions and assets
   6.3 Run `twilio serverless:deploy --env=.env.production --production` to create new service and deploy the functions and assets
7. Run `twilio api:serverless:v1:services:update --ui-editable --sid <SID>` to enable console editing
8. In Twilio console > Task Router > Workspaces > (Default workspace for Flex) > Settings, set the "Event callback URL" to https://<functions path>/dashboardStats

# Credits

Original creation by Eli Kennedy, modified by C.Connolly

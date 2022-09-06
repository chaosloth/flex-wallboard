# Flex Wallboard

Simple UI to show basic wallboard stats

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
   6.2 Run `twilio serverless:deploy --production --env=.env.production` to create new service and deploy the functions and assets
7. Run `twilio api:serverless:v1:services:update --ui-enable` to enable console editing

\*\*\* CREATE TASK ROUTER HOOK

# Credits

Orginal creation by Eli Kennedy, modified by C.Connolly

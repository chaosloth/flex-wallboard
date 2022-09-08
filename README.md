# Flex Wallboard

Simple UI to show basic wallboard stats.

Stats are stored in a SYNC document to which all clients are subscribed by the sync client API. Each time /dashboardStats function is called the latest Task Router statistics are pulled and placed into the document.

## Building

This is a Twilio Serverless project, run `yarn build` to create a new build which will put files into the `assets` folder
See `package.json` for script details, note the build task moves the build folder to assets

## Installation (Twilio Configuration)

1. Create Twilio API key

2. Create new Sync Service (or use default)

3. Create new Sync document in above service called `dashboard-data` (see: `.env` for name)

4. Create another Sync document in the same service called `dashboard-definitions` (see: `.env` for name)

5. Import default statistic definitions from `defaultStats.json`, modify as required.

6. Update `.env` file with API Key, Auth token, Task Router workspace and Sync doc

7. Run `yarn next-build` to create new app build and put it in `assets` folder, note you can build for specific environments with:

   1. `yarn next-build:dev` which uses the `.env.development` file
   2. `yarn next-build:uat` which uses the `.env.uat` file
   3. `yarn next-build:prod` which uses the `.env.production` file

8. Set the timezone variable e.g. `DASHBOARD_TIMEZONE=Australia/Sydney` in `.env` file

9. Execute one of the following commands depending on your environment

   1. Run `twilio serverless:deploy --env=.env.development` to create new service and deploy the functions and assets
   2. Run `twilio serverless:deploy --env=.env.uat --environment=uat` to create new service and deploy the functions and assets
   3. Run `twilio serverless:deploy --env=.env.production --production` to create new service and deploy the functions and assets

10. Run `twilio api:serverless:v1:services:update --ui-editable --sid <SID>` to enable console editing

11. In Twilio console > Task Router > Workspaces > (Default workspace for Flex) > Settings, set the "Event callback URL" to https://<functions path>/dashboardStats

# Troublshooting

If you see "ERR" for a statistic it is an indicator the formula is incorrect. Check that that appropriate breaks have been configured in

# Credits

Original concept by Eli Kennedy, ported to NextJS and Twilio paste by C.Connolly

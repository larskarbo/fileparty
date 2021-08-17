module.exports = {
  apps: [
    {
      name: "personate-checker",
      script: "./node_modules/.bin/ts-node",
      args: "--transpile-only str_scripts/stepForStep.ts",
      cron_restart: "30 * * * *",
      
    },
  ],
};

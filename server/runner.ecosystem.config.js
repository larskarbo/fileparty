module.exports = {
  apps: [
    {
      name: "personate-checker",
      script: "./node_modules/.bin/ts-node",
      args: "--transpile-only module_jobs/jobRunner.ts",
      cron_restart: "30 6,18 * * *",
    },
  ],
};

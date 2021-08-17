module.exports = {
  apps: [
    {
      name: "fileparty-server",
      script: "./node_modules/.bin/ts-node",
      args: "--transpile-only server.ts",
    },
  ],
};

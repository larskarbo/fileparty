module.exports = {
  apps: [
    {
      name: "personate-server",
      script: "./node_modules/.bin/ts-node",
      args: "--transpile-only server.ts",
    },
    // {
    //   name: 'personate-orchestrator',
    //   script: 'xvfb-run --auto-servernum --server-num=1 -s "-ac -screen 0 1280x1024x24" ./node_modules/.bin/ts-node',
    //   args: '--transpile-only scripts/orchestrator.ts',
    // },
  ],
};

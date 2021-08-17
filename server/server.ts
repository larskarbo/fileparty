require("dotenv").config();
import http from "http";
import app from "./serverRoutes";
import { isDev } from "./utils/env";

const server = http.createServer(app);
const PORT = process.env.PORT || 3210;

server.listen(PORT, () => {
  console.log(`${isDev ? "[DEVELOPMENT]" : ""} Listening to port ${PORT}`);
});

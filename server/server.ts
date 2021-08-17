require("dotenv").config();
import http from "http";
import app from "./serverRoutes";
import { isLocal } from "./utils/env";

const server = http.createServer(app);
const PORT = process.env.PORT || 3200;

server.listen(PORT, () => {
  console.log(`${isLocal ? "[DEVELOPMENT]" : ""} Listening to port ${PORT}`);
});

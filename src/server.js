import dns from "dns";

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

import dotenv from "dotenv";
import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";

import {
  initializeSocket,
} from "./socket/index.js";

dotenv.config();

const PORT =
  process.env.PORT || 5000;

connectDB();

/*
|--------------------------------------------------------------------------
| Create HTTP Server
|--------------------------------------------------------------------------
*/

const server =
  http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});

export default server;
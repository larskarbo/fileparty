const express = require("express");
const app = express();
const serverless = require("serverless-http");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

const router = express.Router();

router.get("/board/read/:id", require("./board/read").handler);
router.put("/board/update/:id", require("./board/update").handler);
router.post("/board/create", require("./board/create").handler);

router.get("/test", require("./test").handler);

router.get("/admin/data", require("./admin/data").handler);

app.use("/.netlify/functions/db", router); // path must route to lambda

// app.listen(1337)
module.exports.handler = serverless(app, {
  request(request, event, context) {
    request.clientContext = context.clientContext;
  },
});

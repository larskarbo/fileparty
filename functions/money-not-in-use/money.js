const express = require("express");
const app = express();
const serverless = require("serverless-http");
var bodyParser = require("body-parser");
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}))

const router = express.Router();

router.post("/checkout", require("./checkout").handler);
router.post("/webhook", require("./webhook").handler);
router.post("/testerror", require("./testerror").handler);

// router.get('/collections', (req, res) => {
//   res.json({foo: "bars"});
// });

app.use("/.netlify/functions/money", router); // path must route to lambda

// app.listen(1337)
module.exports.handler = serverless(app, {
  request(request, event, context) {
    request.clientContext = context.clientContext;
  },
});

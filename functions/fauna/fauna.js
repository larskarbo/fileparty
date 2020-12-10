const express = require("express");
const app = express();
const serverless = require("serverless-http");
var bodyParser = require("body-parser");
app.use(bodyParser.json());

const router = express.Router();

router.get("/myCollections", require("./myCollections").handler);
router.get("/collectionsByUser/:username", require("./collectionsByUser").handler);
router.get("/popularCollections", require("./popularCollections").handler);
router.get("/collection/:id", require("./read").handler);
router.put("/collection/:id", require("./update").handler);
router.post("/collection", require("./create").handler);

router.get("/users/getMe", require("./users/getMe").handler);
router.post("/users/setMe", require("./users/setMe").handler);
router.get("/users/find/:id", require("./users/findUser").handler);

router.get("/users/allUsers", require("./users/allUsers").handler);
// router.get('/collections', (req, res) => {
//   res.json({foo: "bars"});
// });

app.use("/.netlify/functions/fauna", router); // path must route to lambda

// app.listen(1337)
module.exports.handler = serverless(app, {
  request(request, event, context) {
    request.clientContext = context.clientContext;
  },
});

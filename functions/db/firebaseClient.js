
var admin = require("firebase-admin");

var serviceAccount = require("../../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ultrashow-123-default-rtdb.firebaseio.com/"
});

// var app = admin.initializeApp();

module.exports = {
  // app,
  admin,
  db: admin.database()
}
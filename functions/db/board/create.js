
const { db } = require("../firebaseClient");
const cryptoRandomString = require('crypto-random-string');

/* export our lambda function as named "handler" export */
exports.handler = async (req, res) => {
  /* parse the string body into a useable JS object */
  const data = req.body
  const boardId = cryptoRandomString({ length: 6 })
  
  var boards = db.ref("boards");
  boards.child(boardId).set(data)
    .then(response => {
      console.log("🚀 ~ response", response)
      /* Success! return the response with statusCode 200 */
      res.json(response.data)
    })
    .catch(error => {
      console.log('error', error)
      /* Error! return the error with statusCode 400 */
      res.status(400).json({
        error
      })
    })
}

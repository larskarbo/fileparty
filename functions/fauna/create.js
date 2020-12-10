const faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
exports.handler = async (req, res) => {
  /* parse the string body into a useable JS object */
  const data = req.body
  const item = {
    data,
  }
  /* construct the fauna query */
  return client
    .query(q.Create(
      q.Collection('slapCollections'),
      item,
    )
    )
    .then(response => {
      /* Success! return the response with statusCode 200 */
      res.json(response)
    })
    .catch(error => {
      console.log('error', error)
      /* Error! return the error with statusCode 400 */
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      }
    })
}

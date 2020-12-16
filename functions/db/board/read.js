const { q, client } = require("../firebaseClient");

exports.handler = async (req, res) => {
  console.log('process.env.FAUNADB_SERVER_SECRET: ', process.env.FAUNADB_SERVER_SECRET);
  const id = req.params.id
  console.log(`Function 'read' invoked. Read id: ${id}`)
  return client
    .query(q.Get(q.Match(q.Index('boardByBoardId'), id)))
    .then(response => {
      console.log('success', response)
      res.json(response)
    })
    .catch(error => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      }
    })
}

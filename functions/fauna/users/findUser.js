const faunadb = require('faunadb')

/* configure faunaDB Client with our secret */
const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})

/* export our lambda function as named "handler" export */
exports.handler = async (req, res) => {
  
  console.log('process.env.FAUNADB_SERVER_SECRET: ', process.env.FAUNADB_SERVER_SECRET);
  const id = req.params.id
  console.log(`Function 'read' invoked. Read id: ${id}`)
  return client
    .query(
      q.Get(
        q.Match(q.Index('users_index'), id)
      )
    )
    .then(response => {
      console.log('success', response)
      res.json(response)
    })
}

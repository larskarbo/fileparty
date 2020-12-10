/* Import faunaDB sdk */
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET,
})
exports.handler = async (req, res) => {
  const { user } = req.clientContext;
  console.log("user: ", user);
  if (!user) {
    return res.status(400).json({
      error: {
        message: "no user"
      }
    })
  }

  client
    .query(q.Paginate(q.Match(q.Index('slap_by_useridstring'), user.sub)))
    .then(response => {
      const itemRefs = response.data
      console.log('itemRefs: ', itemRefs);
      // create new query out of item refs. http://bit.ly/2LG3MLg
      const getAllItemsDataQuery = itemRefs.map(ref => {
        return q.Get(ref)
      })
      // then query the refs
      client.query(getAllItemsDataQuery).then(ret => {
        res.json(ret)
      })
    })
    .catch(error => {
      console.log('error', error)
      res.status(400).json(error)
    })
}

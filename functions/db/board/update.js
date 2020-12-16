const { q, client } = require("../firebaseClient");

exports.handler = async (req, res) => {
  // const data = JSON.parse(req.body.data)
  const data = req.body
  const id = req.params.id
  return client
    .query(q.Get(q.Match(q.Index("boardByBoardId"), id)))
    .then((response) => {
      return client
        .query(q.Update(response.ref, { data }))
        .then(response => {
          res.json(response)
        })

        .catch(error => {
          console.log('error1', error)
          return res.json(400, error);
        })
    })
    .catch(error => {
      console.log('error2', error)
      return res.json(400, error);
    })
}

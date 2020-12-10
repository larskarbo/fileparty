const { q, client } = require("../faunaClient");

exports.handler = async (req, res) => {
  const { user } = req.clientContext;
  console.log("user: ", user);
  const data = req.body
  if (!user) {
    return res.status(400).json({
      error: {
        message: "no user"
      }
    })
  }

  return client
    .query(q.Get(q.Match(q.Index("users_index"), user.sub)))
    .then((response) => {
      return client
        .query(q.Update(response.ref, { data }))
        .then(response => {
          res.json(response)
        })
        .catch(error => {
          console.log('error', error.message)
          if(error.message == "instance not unique"){
            res.status(409)
          } else {
            res.status(400)
          }
          return res.send({
            error: {
              message: error.message,
            }
          });
        })
    })
    .catch((error) => {
      return res.json(400, error);
    });



};

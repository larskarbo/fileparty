const { q, client } = require("../faunaClient");

exports.handler = async (req, res) => {
  const { user } = req.clientContext;
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
      console.log("response: ", response);
      res.json(response.data);
    })
    .catch((error) => {
      if (error.requestResult.statusCode == 404) {
        // need to create a user
        const userItem = {
          id: user.sub,
          email: user.email,
          name: user.user_metadata.full_name,
        };
        console.log('userItem: ', userItem);

        // return res.json(400, {});
        // return res.json(userItem);

        return client
          .query(q.Create(q.Collection("users"), {data: userItem}))
          .then((response) => {
            console.log("success", response);
            /* Success! return the response with statusCode 200 */
            res.json(response.data);
          })
          .catch((error) => {
            console.log("error", error);
            return res.json(400, error);
          });
      } else {
        return res.json(400, error);
      }
    });
};

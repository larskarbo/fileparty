
exports.handler = async (req, res) => {
  res.status(400);
  res.send({
    error: {
      message: "Some random error",
    }
  })
}

const { admin } = require("../firebaseClient");

exports.handler = async (req, res) => {

  

  admin.auth()
  .listUsers(1000)
  .then((getUsersResult) => {
    res.json(getUsersResult);
    // console.log('Successfully fetched user data:');
    // getUsersResult.users.forEach((userRecord) => {
    //   console.log(userRecord);
    // });

    // console.log('Unable to find users corresponding to these identifiers:');
    // getUsersResult.notFound.forEach((userIdentifier) => {
    //   console.log(userIdentifier);
    // });
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
  // res.status(400).json({
  //   error: {
  //     message: "test error"
  //   }
  // })
}

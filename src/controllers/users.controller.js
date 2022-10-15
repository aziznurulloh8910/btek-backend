const userModel =  require("../models/users.model");

exports.createUsers = async(req, res) => {
  const insert = await userModel.insertUser(req.body);
  const user = insert.rows[0];
  return res.json({
    success: true,
    message: "Create user success",
    results: user
  });
};

exports.readAllUsers = (req, res) => {
  return res.json({
    success: true,
    message: "Response from readAllUsers"
  });
};

exports.readUserById = (req, res) => {
  const {id} = req.params;
  return res.json({
    success: true,
    message: "Hello, "+id
  });
};

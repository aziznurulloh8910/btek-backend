const userModel =  require("../models/users.model");

exports.createUsers = async(req, res) => {
  try {
    const insert = await userModel.insertUser(req.body);
    const user = insert.rows[0];
    return res.json({
      success: true,
      message: "Create user success",
      results: user
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error : "+err.message
    });
  }
};

exports.readAllUsers = async(req, res) => {
  try {
    const users = await userModel.selectAllUsers();
    return res.json({
      success: true,
      message: "List all users",
      results: users.rows
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error : "+err.message
    });
  }
};

exports.readUserById = async(req, res) => {
  try {
    const user = await userModel.selectUserById(req.params.id);
    return res.json({
      success: true,
      message: "Detail user",
      results: user.rows[0]
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error : "+err.message
    });
  }
};

exports.editUser = async(req, res) => {
  try {
    const update = await userModel.editUser(req.params.id, req.body);
    const user = update.rows[0];
    return res.json({
      success: true,
      message: "Update user success",
      results: user
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error : "+err.message
    });
  }
};

exports.deleteUser = async(req, res) => {
  try {
    const user = await userModel.deleteUser(req.params.id);
    return res.json({
      success: true,
      message: "User deleted",
      results: user.rows[0]
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error : "+err.message
    });
  }
};

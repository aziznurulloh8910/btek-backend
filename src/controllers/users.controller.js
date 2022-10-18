const userModel =  require("../models/users.model");

exports.createUser = async(req, res) => {
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
  req.query.offset = (req.query.page - 1) * req.query.limit;
  try {
    const users = await userModel.selectAllUsers(req.query);
    const {rowCount} = await userModel.selectAll(req.query);
    const pageInfo = {
      page: req.query.page,
      limit: req.query.limit
    };
    pageInfo.totalPage = Math.ceil(rowCount / req.query.limit);
    pageInfo.nextPage = req.query.page < pageInfo.totalPage ? req.query.page + 1 : null;
    pageInfo.prevPage = req.query.page > 1 ? req.query.page - 1 : null;
    pageInfo.totalData = rowCount;
    return res.json({
      success: true,
      message: "List all users",
      pageInfo,
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

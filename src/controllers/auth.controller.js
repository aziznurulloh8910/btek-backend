/* eslint-disable no-undef */
const userModel = require("../models/users.model");
const profileModel = require("../models/profile.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const user = await userModel.selectUserByEmail(req.body.email);
    if(user.rowCount){
      const selectedUser = user.rows[0];
      const valid = await argon.verify(selectedUser.password, req.body.password);
      if(valid) {
        const {id} = selectedUser;
        const payload = {id};
        const token = jwt.sign(payload, process.env.APP_SECRET || "default-key");
        return res.json({
          success: true,
          message: "Login success",
          results: {
            token
          }
        });
      }
    }
    return res.status(401).json({
      success: false,
      message: "Wrong email or password"
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error: "+err.message
    });
  }
};


exports.register = async (req, res) => {
  try {
    req.body.password = await argon.hash(req.body.password);
    const user = await userModel.insertUser(req.body);
    if(user.rowCount) {
      const createdUser = user.rows[0];
      req.body.userId = createdUser.id;
      const profile = await profileModel.insertProfile(req.body);
      if(profile.rowCount){
        return res.json({
          success: true,
          message: "Register successfully"
        });
      }
    }
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error: "+err.message
    });
  }
};

exports.forgotPassword = async(req, res) => {
  try {
    const insert = await userModel.insertEmail(req.body);
    const email = insert.rows[0];
    return res.json({
      success: true,
      message: "Email sent",
      results: email
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error: "+err.message
    });
  }
};

exports.resetPassword = async(req, res) => {
  try {
    req.body.newPassword = await argon.hash(req.body.newPassword);
    req.body.confirmPassword = await argon.hash(req.body.confirmPassword);
    const insert = await userModel.insertPassword(req.body);
    const pass = insert.rows[0];
    return res.json({
      success: true,
      message: "New password sent",
      results: pass
    });
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error: "+err.message
    });
  }
};

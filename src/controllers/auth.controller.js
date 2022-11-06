/* eslint-disable no-undef */
const userModel = require("../models/users.model");
const profileModel = require("../models/profile.model");
const forgotPasswordModel = require("../models/forgorPassword.model");
const argon = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer =  require("nodemailer");

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
          message: "Register successfully",
          results: createdUser,
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
    const {customAlphabet} = await import("nanoid");
    const nanoid = customAlphabet("0123456789", 6);
    req.body.code = nanoid();

    const user =  await userModel.selectUserByEmail(req.body.email);
    if(user.rowCount){
      const selectedUser = user.rows[0];
      req.body.userId = selectedUser.id;
      
      const forgot = await forgotPasswordModel.insertForgotPassword(req.body);
      
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS_EMAIL
        },
      });
      
      await transporter.sendMail({
        from: process.env.EMAIL, 
        to: req.body.email, 
        subject: "Code Confirmation",
        html: "<b>CODE\n"+req.body.code+"</b>"
      });

      if(forgot.rowCount){
        return res.json({
          success: true,
          message: "Forgot password request has been sent!",
          results: forgot.rows[0]
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Email not found"
      });
    }

  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error: "+err.message
    });
  }
};

exports.resetPassword = async(req, res) => {
  try {
    const user = await forgotPasswordModel.selectForgotPassword(req.body);
    if(user.rowCount){
      const selectedUser = user.rows[0];
      req.body.password = await argon.hash(req.body.newPassword);

      const updatePassword = await userModel.editUser(selectedUser.userId, req.body);
      if(updatePassword.rowCount){
        return res.json({
          success: true,
          message: "Reset password successfully",
          results: updatePassword.rows[0],
        });
      }
      return res.status(500).json({
        success: false,
        message: "Unexpected error on updating data!"
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email or code cannot be identified"
      });
    }
  } catch(err) {
    return res.status(500).json({
      success: false,
      message: "Error: "+err.message
    });
  }
};

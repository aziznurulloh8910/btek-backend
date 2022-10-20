const auth =  require("express").Router();

const {validEmail, passwordConfirmation, check} = require("../middlewares/validator.middleware");

auth.post("/login", validEmail, check, require("../controllers/auth.controller").login);
auth.post("/register", require("../controllers/auth.controller").register);
auth.post("/forgot-password", validEmail, check, require("../controllers/auth.controller").forgotPassword);
auth.post("/reset-password", validEmail, passwordConfirmation, check, require("../controllers/auth.controller").resetPassword);

module.exports = auth;

const users =  require("express").Router();

const userController = require("../controllers/users.controller");
const {basicUserCreds, paramsUUID, paging, check} = require("../middlewares/validator.middleware");

users.get("/", paging, check, userController.readAllUsers);
users.get("/:id", paramsUUID, check, userController.readUserById);
users.post("/", basicUserCreds, check, userController.createUser);
users.put("/:id", paramsUUID, basicUserCreds, check, userController.editUser);
users.delete("/:id", paramsUUID, check, userController.deleteUser);


module.exports = users;

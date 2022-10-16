const users =  require("express").Router();

const userController = require("../controllers/users.controller");

users.get("/", userController.readAllUsers);
users.get("/:id", userController.readUserById);
users.post("/", userController.createUsers);
users.put("/:id", userController.editUser);
users.delete("/:id", userController.deleteUser);


module.exports = users;

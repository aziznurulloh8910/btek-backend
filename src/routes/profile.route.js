const profile = require("express").Router();

const {paramsUUID, basicUserCreds, check} =  require("../middlewares/profile.middleware");
const upload = require("../middlewares/cloudinary.middleware");

profile.get("/", require("../controllers/profile.controller").readProfileById);
profile.get("/:id", paramsUUID, check, require("../controllers/profile.controller").readProfileById);
profile.put("/", upload("picture"), basicUserCreds, check, require("../controllers/profile.controller").updateProfile);

module.exports = profile;

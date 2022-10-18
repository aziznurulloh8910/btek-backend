const {body, param, query, matchedData, validationResult} = require("express-validator");

exports.basicUserCreds = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("password").isLength({min:4}).withMessage("Password length must be 4 char or more")
];

exports.paramsUUID = [
  param("id").isUUID(4).withMessage("Invalid ID")
];

exports.paging = [
  (req, res, next) => {
    req.query.page = req.query.page || 1;
    req.query.limit = req.query.limit || 5;
    req.query.sortBy = req.query.sortBy || "createdAt";
    req.query.searchBy = req.query.searchBy || "email";
    req.query.search = req.query.search || "";
    req.query.reverse = req.query.reverse || "0";
    return next();
  },
  query("page").optional().toInt(10),
  query("limit").optional().toInt(10),
  query("reverse").optional().toBoolean(),
  query("searchBy").isIn(["email"]).withMessage("Data not found"),
  query("search").optional().trim(),
  query("sortBy").isIn(["email", "createdAt", "updatedAt"]).withMessage("Data not found")

];

exports.check = (req, res, next)=> {
  const errorValidation = validationResult(req);
  console.log(matchedData(req, {includeOptional: true}));
  if(!errorValidation.isEmpty()){
    return res.status(400).json({
      success: false,
      message: "Validation error",
      results: errorValidation.array()
    });
  }
  return next();
};

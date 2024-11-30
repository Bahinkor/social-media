const express = require("express");
const userController = require("./user.controller");
const auth = require("./../../middlewares/auth.middleware");
const {multerStorage} = require("./../../middlewares/uploaderConfigs");
const validator = require("./../../middlewares/validator.middleware");
const {updateUserDataValidationSchema} = require("./user.validator");

const userRouter = express.Router();
const uploader = multerStorage("public/images/profiles");

userRouter.route("/edit-profile")
    .get(auth, userController.showViewEditProfile)
    .post(auth, uploader.single("profilePicture"), validator(updateUserDataValidationSchema), userController.editData);

module.exports = userRouter;
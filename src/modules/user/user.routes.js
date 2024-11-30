const express = require("express");
const userController = require("./user.controller");
const auth = require("./../../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.route("/edit-profile")
    .get(auth, userController.showViewEditProfile);

module.exports = userRouter;
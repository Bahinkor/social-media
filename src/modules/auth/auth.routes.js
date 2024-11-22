const express = require("express");
const authController = require("./auth.controller");

const authRouter = express.Router();

authRouter.route("/register")
    .post(authController.register);

module.exports = authRouter;
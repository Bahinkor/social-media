const express = require("express");
const authController = require("./auth.controller");
const validatorMiddleware = require("./../../middlewares/validator.middleware");
const {registerValidatorSchema} = require("./auth.validator");

const authRouter = express.Router();

authRouter.route("/register")
    .get(authController.showRegisterView)
    .post(validatorMiddleware(registerValidatorSchema), authController.register);

module.exports = authRouter;
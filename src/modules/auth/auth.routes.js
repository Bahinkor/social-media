const express = require("express");
const authController = require("./auth.controller");
const validatorMiddleware = require("./../../middlewares/validator.middleware");
const {registerValidationSchema, loginValidationSchema} = require("./auth.validator");

const authRouter = express.Router();

authRouter.route("/register")
    .get(authController.showRegisterView)
    .post(validatorMiddleware(registerValidationSchema), authController.register);

authRouter.route("/login")
    .get(authController.showLoginView)
    .post(validatorMiddleware(loginValidationSchema), authController.login);

authRouter.route("/refresh")
    .put(authController.refreshToken);

authRouter.route("/forget-password")
    .get(authController.showForgetPasswordView)
    .post(authController.forgetPassword);

authRouter.route("/reset-password/:token")
    .get(authController.showResetPasswordView);

authRouter.route("/reset-password")
    .post(authController.resetPassword);

module.exports = authRouter;
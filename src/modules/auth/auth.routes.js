const express = require("express");
const authController = require("./auth.controller");
const validatorMiddleware = require("./../../middlewares/validator.middleware");
const {
    registerValidationSchema,
    loginValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema
} = require("./auth.validator");

const authRouter = express.Router();

authRouter.route("/register")
    .post(validatorMiddleware(registerValidationSchema), authController.register);

authRouter.route("/login")
    .post(validatorMiddleware(loginValidationSchema), authController.login);

authRouter.route("/refresh")
    .put(authController.refreshToken);

authRouter.route("/forget-password")
    .post(validatorMiddleware(forgetPasswordValidationSchema), authController.forgetPassword);

authRouter.route("/reset-password")
    .post(validatorMiddleware(resetPasswordValidationSchema), authController.resetPassword);

module.exports = authRouter;
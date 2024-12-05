const joi = require("joi");

const registerValidationSchema = joi.object({
    email: joi.string()
        .email()
        .required(),
    username: joi.string()
        .trim()
        .min(3)
        .max(200)
        .required(),
    name: joi.string()
        .trim()
        .min(1)
        .max(200)
        .required(),
    password: joi.string()
        .min(6)
        .max(50)
        .required(),
});

const loginValidationSchema = joi.object({
    username: joi.string()
        .min(3)
        .max(200)
        .required(),
    password: joi.string()
        .min(6)
        .max(50)
        .required(),
});

const forgetPasswordValidationSchema = joi.object({
    email: joi.string()
        .email()
        .required(),
});

module.exports = {
    registerValidationSchema,
    loginValidationSchema,
    forgetPasswordValidationSchema,
};
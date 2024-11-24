const joi = require("joi");

const registerValidatorSchema = joi.object({
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

const loginValidatorSchema = joi.object({
    username: joi.string()
        .min(3)
        .max(200)
        .required(),
    password: joi.string()
        .min(6)
        .max(50)
        .required(),
});

module.exports = {
    registerValidatorSchema,
    loginValidatorSchema,
};
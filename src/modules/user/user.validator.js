const joi = require("joi");

const updateUserDataValidationSchema = joi.object({
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
});

module.exports = {
    updateUserDataValidationSchema,
};
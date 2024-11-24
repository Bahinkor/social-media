const joi = require("joi");

const createPostValidationSchema = joi.object({
    description: joi.string()
        .min(1)
        .max(750)
        .required(),
    hashtags: joi.string(),
});

module.exports = {
    createPostValidationSchema
};
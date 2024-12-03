const joi = require("joi");

const createPostValidationSchema = joi.object({
    description: joi.string()
        .min(1)
        .max(750)
        .required(),
    hashtags: joi.string()
        .min(0),
});

const createCommentValidationSchema = joi.object({
    postID: joi.string()
        .required(),
    content: joi.string()
        .min(1)
        .max(3000)
        .required(),
    parent: joi.string(),
});

module.exports = {
    createPostValidationSchema,
    createCommentValidationSchema,
};
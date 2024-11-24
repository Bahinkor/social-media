const express = require("express");
const postController = require("./post.controller");
const validationMiddleware = require("./../../middlewares/validator.middleware")
const {createPostValidationSchema} = require("./post.validator");

const postRouter = express.Router();

postRouter.route("/")
    .get(postController.showPostUploadView)
    .post(validationMiddleware(createPostValidationSchema), postController.createPost);

module.exports = postRouter;
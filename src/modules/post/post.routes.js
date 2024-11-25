const express = require("express");
const postController = require("./post.controller");
const validationMiddleware = require("./../../middlewares/validator.middleware")
const {createPostValidationSchema} = require("./post.validator");
const authMiddleware = require("./../../middlewares/auth.middleware");

const postRouter = express.Router();

postRouter.route("/")
    .get(authMiddleware, postController.showPostUploadView)
    .post(authMiddleware, validationMiddleware(createPostValidationSchema), postController.createPost);

module.exports = postRouter;
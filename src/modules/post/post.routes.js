const express = require("express");
const postController = require("./post.controller");
const validationMiddleware = require("./../../middlewares/validator.middleware")
const {createPostValidationSchema} = require("./post.validator");
const authMiddleware = require("./../../middlewares/auth.middleware");
const accountVerifyMiddleware = require("./../../middlewares/accountVerify.middleware");

const postRouter = express.Router();

postRouter.route("/")
    .get(authMiddleware, accountVerifyMiddleware, postController.showPostUploadView)
    .post(authMiddleware, accountVerifyMiddleware, validationMiddleware(createPostValidationSchema), postController.createPost);

module.exports = postRouter;
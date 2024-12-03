const express = require("express");
const postController = require("./post.controller");
const validationMiddleware = require("./../../middlewares/validator.middleware")
const {createPostValidationSchema, createCommentValidationSchema} = require("./post.validator");
const authMiddleware = require("./../../middlewares/auth.middleware");
const accountVerifyMiddleware = require("./../../middlewares/accountVerify.middleware");
const {multerStorage} = require("./../../middlewares/uploaderConfigs");

const postRouter = express.Router();
const uploader = multerStorage("public/images/posts", /jpeg|jpg|png|webp|mp4|mkv/);

postRouter.route("/")
    .get(authMiddleware, accountVerifyMiddleware, postController.showPostUploadView)
    .post(authMiddleware, uploader.single("media"), validationMiddleware(createPostValidationSchema), postController.createPost);

postRouter.route("/like")
    .post(authMiddleware, postController.like);

postRouter.route("/dislike")
    .post(authMiddleware, postController.dislike);

postRouter.route("/save")
    .post(authMiddleware, postController.save);

postRouter.route("/unsave")
    .post(authMiddleware, postController.unsave);

postRouter.route("/save")
    .get(authMiddleware, postController.showSaveView);

postRouter.route("/:postID/remove")
    .post(authMiddleware, postController.removePost);

postRouter.route("/new-comment")
    .post(authMiddleware, validationMiddleware(createCommentValidationSchema), postController.newComment);

module.exports = postRouter;
const express = require("express");
const postController = require("./post.controller");
const validationMiddleware = require("./../../middlewares/validator.middleware")
const {createPostValidationSchema, createCommentValidationSchema} = require("./post.validator");
const authMiddleware = require("./../../middlewares/auth.middleware");
const {multerStorage} = require("./../../middlewares/uploaderConfigs");

const postRouter = express.Router();
const uploader = multerStorage("public/images/posts", /jpeg|jpg|png|webp|mp4|mkv/);

postRouter.route("/")
    .post(authMiddleware, uploader.single("media"), validationMiddleware(createPostValidationSchema), postController.createPost);

postRouter.route("/like")
    .post(authMiddleware, postController.like);

postRouter.route("/dislike")
    .delete(authMiddleware, postController.dislike);

postRouter.route("/save")
    .get(authMiddleware, postController.getSavedPosts)
    .post(authMiddleware, postController.save);

postRouter.route("/unsave")
    .delete(authMiddleware, postController.unsave);

postRouter.route("/:postID/remove")
    .delete(authMiddleware, postController.removePost);

postRouter.route("/new-comment")
    .post(authMiddleware, validationMiddleware(createCommentValidationSchema), postController.newComment);

postRouter.route("/:postID/comments?p=pageID")
    .get(authMiddleware, postController.getComments);

module.exports = postRouter;
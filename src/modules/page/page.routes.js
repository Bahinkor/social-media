const express = require("express");
const pageController = require("./page.controller");
const auth = require("../../middlewares/auth.middleware");

const pageRouter = express.Router();

pageRouter.route("/:pageID")
    .get(auth, pageController.getPageInfo);

pageRouter.route("/:pageID/followers")
    .get(auth, pageController.getFollowers);

pageRouter.route("/:pageID/followings")
    .get(auth, pageController.getFollowings);

pageRouter.route("/:pageID/follow")
    .post(auth, pageController.follow);

pageRouter.route("/:pageID/unfollow")
    .post(auth, pageController.unfollow);

module.exports = pageRouter;
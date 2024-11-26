const express = require("express");
const pageController = require("./page.controller");
const auth = require("../../middlewares/auth.middleware");

const pageRouter = express.Router();

pageRouter.route("/:pageID")
    .get(auth, pageController.getPage);

module.exports = pageRouter;
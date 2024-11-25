const express = require("express");
const pageController = require("./page.controller");

const pageRouter = express.Router();

pageRouter.route("/:userId")
    .get(pageController.getPage);

module.exports = pageRouter;
const express = require("express");
const homeController = require("./home.controller");

const homeRouter = express.Router();

homeRouter.route("/")
    .get(homeController.showViewHome);

module.exports = homeRouter;
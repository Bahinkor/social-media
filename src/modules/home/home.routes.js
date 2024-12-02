const express = require("express");
const homeController = require("./home.controller");
const auth = require("./../../middlewares/auth.middleware");

const homeRouter = express.Router();

homeRouter.route("/")
    .get(auth, homeController.showViewHome);

module.exports = homeRouter;
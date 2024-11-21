const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
// parser middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
ap.use(cookieParser());

module.exports = app;
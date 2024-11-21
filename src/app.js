const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// security policy middlewares
app.use(cors());
app.use(helmet());

// parser middlewares
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cookieParser());

// logger middleware
app.use(morgan("dev"));

// static folders
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/fonts", express.static(path.join(__dirname, "public/fonts")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// routes
app.get("/", (req, res) => {
    res.render("index");
});

// 404 error handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "this route is not found."
    });
});

// 500 error handler
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message || "Something went wrong.",
    });
});

module.exports = app;
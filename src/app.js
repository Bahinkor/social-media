const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const homeRouter = require("./modules/home/home.routes");
const authRoutes = require("./modules/auth/auth.routes");
const postRoutes = require("./modules/post/post.routes");
const pageRoutes = require("./modules/page/page.routes");
const userRoutes = require("./modules/user/user.routes");
const apiDocRoutes = require("./modules/apiDoc/swagger.routes");
const session = require("express-session");

const app = express();

// security policy middlewares
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", "'unsafe-inline'", "https://unpkg.com"],
            "script-src-attr": ["'self'", "'unsafe-inline'"],
        },
    },
}));

// session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// parser middlewares
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb", extended: true}));
app.use(cookieParser());

// logger middleware
app.use(morgan("dev"));

// static folders
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// * routes
app.use("/", homeRouter);
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/page", pageRoutes);
app.use("/user", userRoutes);
app.use("/api-doc", apiDocRoutes);

// ! 404 error handler
app.use((req, res, next) => {
    res.status(404).json({
        message: "this route is not found."
    });
});

// ! 500 error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: err.message || err.msg || "Something went wrong.",
    });
});

module.exports = app;
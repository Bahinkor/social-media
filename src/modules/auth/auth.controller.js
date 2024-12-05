const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userModel = require("./../../models/User.model");
const refreshTokenModel = require("../../models/RefreshToken.model");
const resetPasswordModel = require("../../models/ResetPassword.model");
const {transporter} = require("./../../config/nodemailer")

exports.showRegisterView = (req, res) => {
    res.render("auth/register");
};

exports.register = async (req, res) => {
    try {
        const {
            email,
            username,
            name,
            password,
        } = req.body;

        const isUserExist = await userModel.findOne({
            $or: [{email}, {username}],
        });

        if (isUserExist) {
            req.flash("error", "User already exists!");
            return res.redirect("/auth/register");

            // return res.status(400).json({
            //     message: "User already exists!",
            // });
        }

        const usersCount = await userModel.countDocuments({});

        const user = await userModel.create({
            email,
            username,
            name,
            password,
            role: +usersCount < 1 ? "ADMIN" : "USER",
        });

        const accessToken = jwt.sign({userID: user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30day"
        });

        // * refresh token static method
        const refreshToken = await refreshTokenModel.createToken(user);

        // access & refresh token set cookie
        res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        req.flash("success", "User registered successfully.");
        res.redirect("/auth/register");

        // res.status(201).json({
        //     message: "User created successfully",
        // });

    } catch (err) {
        console.log(`auth, register controller failed. error: ${err}`);
        req.flash("error", "Internal Server Error!");
        res.redirect("/auth/redirect");

        // res.status(500).json({
        //     message: err.message || "Something went wrong.",
        // });
    }
};

exports.showLoginView = (req, res) => {
    res.render("auth/login");
};

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await userModel.findOne({username});

        if (!user) {
            req.flash("error", "User is not found!");
            return res.redirect("/auth/login");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            req.flash("error", "username or password invalid!");
            return res.redirect("/auth/login");
        }

        const accessToken = jwt.sign({userID: user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30day"
        });

        // * refresh token static method
        const refreshToken = await refreshTokenModel.createToken(user);

        // access & refresh token set cookie
        res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        req.flash("success", "User sign ind successfully.");
        res.redirect("/auth/login");

    } catch (err) {
        console.log(`auth, login controller failed. error: ${err}`);
        req.flash("error", "Internal Server Error!");
        res.redirect("/auth/login");
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;

        const userID = await refreshTokenModel.verifyToken(refreshToken);

        if (!userID) {
            return res.status(400).json({
                message: "Refresh token not valid!"
            });
        }

        await refreshTokenModel.findOneAndDelete({
            token: refreshToken,
        });

        const user = userModel.findOne({
            _id: userID
        });

        if (!user) {
            return res.status(404).json({
                message: "User is not found!"
            });
        }

        const accessToken = jwt.sign({userID: user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30day"
        });

        const newRefreshToken = await refreshTokenModel.createToken(user);

        // access & refresh token set cookie
        res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        res.cookie("refresh-token", newRefreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

    } catch (err) {
        next(err);
    }
};

exports.showForgetPasswordView = (req, res) => {
    res.render("auth/forget-password");
};

exports.forgetPassword = async (req, res, next) => {
    try {
        const {email} = req.body;

        const user = await userModel.findOne({
            email,
        });

        if (!user) {
            req.flash("error", "Email is not valid!");
            return res.redirect("/auth/forget-password");
        }

        const resetToken = crypto.randomBytes(16).toString("hex");

        const resetTokenExpireTime = Date.now() + 1000 * 60 * 10;

        await resetPasswordModel.create({
            user: user._id,
            token: resetToken,
            tokenExpireTime: resetTokenExpireTime,
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password Link",
            html: `
<h2>Hi, ${user.name}</h2>
            <a href="http://localhost:${process.env.PORT}/auth/reset-password/${resetToken}">Reset Password Link</a>
            `,
        };

        transporter.sendMail(mailOptions);

        req.flash("success", "Email sent successfully.");
        res.redirect("/auth/forget-password");

    } catch (err) {
        next(err);
    }
};

exports.showResetPasswordView = (req, res) => {
    res.render("auth/reset-password");
};

exports.resetPassword = async (req, res, next) => {
    try {
        const {token, password} = req.body;

        const resetPassword = await resetPasswordModel.findOne({
            token,
            tokenExpireTime: {
                $gt: Date.now(),
            }
        });

        if (!resetPassword) {
            req.flash("error", "invalid or expired token!");
            return res.redirect("/auth/forget-password");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await userModel.findOneAndUpdate(
            {
                _id: resetPassword.user,
            },
            {
                password: hashedPassword,
            }
        );

        if (!user) {
            req.flash("error", "user not found!");
            return res.redirect("/auth/forget-password");
        }

        await resetPasswordModel.findOneAndDelete({
            token,
        });

        req.flash("success", "Reset password successfully.");
        res.redirect("/auth/login");

    } catch (err) {
        next(err);
    }
};
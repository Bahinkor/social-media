const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userModel = require("./../../models/User.model");
const refreshTokenModel = require("../../models/RefreshToken.model");
const resetPasswordModel = require("../../models/ResetPassword.model");
const {transporter} = require("./../../config/nodemailer")

exports.register = async (req, res, next) => {
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
            return res.status(422).json({
                message: "User already exists!",
            });
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
            path: "/",
        });

        res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        res.status(201).json({
            message: "User created successfully",
        });

    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await userModel.findOne({username});

        if (!user) {
            return res.status(404).json({
                message: "User is not found!",
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "username or password invalid!",
            });
        }

        const accessToken = jwt.sign({userID: user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "30day"
        });

        // * refresh token static method
        const refreshToken = await refreshTokenModel.createToken(user);

        // access & refresh token set cookie
        res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/",
        });

        res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            path: "/",
        });

        res.json({
            message: "User logged in successfully.",
        });

    } catch (err) {
        next(err);
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

exports.forgetPassword = async (req, res, next) => {
    try {
        const {email} = req.body;

        const user = await userModel.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                message: "User email is not found!"
            });
        }

        const resetToken = crypto.randomBytes(16).toString("hex");

        const resetTokenExpireTime = Date.now() + 1000 * 60 * 10;

        await resetPasswordModel.create({
            user: user._id,
            token: resetToken,
            tokenExpireTime: resetTokenExpireTime,
        });

        // * mail options for nodemailer (send forget password email to user)
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset Password Link",
            html: `
<h2>Hi, ${user.name}</h2>
            <a href="${process.env.FRONT_URL}/auth/reset-password/${resetToken}">Reset Password Link</a>
            `,
        };

        transporter.sendMail(mailOptions);

        res.json({
            message: "Email sent successfully.",
        });

    } catch (err) {
        next(err);
    }
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
            return res.status(403).json({
                message: "invalid or expired token!",
            });
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
            return res.status(404).json({
                message: "User is not found!",
            });
        }

        await resetPasswordModel.findOneAndDelete({
            token,
        });

        res.json({
            message: "Reset password successfully.",
        });

    } catch (err) {
        next(err);
    }
};
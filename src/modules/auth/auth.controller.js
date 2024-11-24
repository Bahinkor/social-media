const jwt = require("jsonwebtoken");
const userModel = require("./../../models/User.model");
const refreshTokenModel = require("../../models/RefreshToken.model");

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
            maxAge: 900_000,
            httpOnly: true,
            path: "/",
        });

        res.cookie("refresh-token", refreshToken, {
            maxAge: 900_000,
            httpOnly: true,
            path: "/",
        });

        req.flash("success", "User registered successfully.");
        return res.redirect("/auth/register");

        // res.status(201).json({
        //     message: "User created successfully",
        // });

    } catch (err) {
        console.log(`auth, register controller failed. error: ${err}`);
        req.flash("error", "Internal Server Error!");

        // res.status(500).json({
        //     message: err.message || "Something went wrong.",
        // });
    }
};
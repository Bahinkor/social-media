const jwt = require("jsonwebtoken");
const userModel = require("./../models/User.model");

const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies["access-token"];

        if (!accessToken) {
            req.flash("error", "please login first.");
            return res.redirect("/auth/login");
        }

        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!payload) {
            req.flash("error", "please login first.");
            return res.redirect("/auth/login");
        }

        const userID = payload.userID;

        const user = await userModel.findOne({
            _id: userID,
        }).lean();

        if (!user) {
            req.flash("error", "please login first.");
            return res.redirect("/auth/login");
        }

        req.user = user;
        next();

    } catch (err) {
        console.error(`auth middleware error: ${err}`);
        req.flash("error", "please login first.");
        res.redirect("/auth/login");
    }
};

module.exports = authMiddleware;
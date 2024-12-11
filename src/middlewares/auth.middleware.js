const jwt = require("jsonwebtoken");
const userModel = require("./../models/User.model");

const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies["access-token"];

        if (!accessToken) {
            return res.status(401).json({
                message: "User is not logged in.",
            });
        }

        const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        if (!payload) {
            return res.status(401).json({
                message: "User is not logged in.",
            });
        }

        const userID = payload.userID;

        const user = await userModel.findOne({
            _id: userID,
        }).lean();

        if (!user) {
            return res.status(401).json({
                message: "User is not logged in.",
            });
        }

        req.user = user;
        next();

    } catch (err) {
        next(err);
    }
};

module.exports = authMiddleware;
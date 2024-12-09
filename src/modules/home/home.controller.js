const {getUserInfo} = require("./../../utils/helper");

exports.getUserData = async (req, res, next) => {
    try {
        const userInfo = await getUserInfo(req.user._id);

        res.json({
            user: userInfo,
        });

    } catch (err) {
        next(err);
    }
};
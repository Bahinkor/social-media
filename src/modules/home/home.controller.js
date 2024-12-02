const {getUserInfo} = require("./../../utils/helper");

exports.showViewHome = async (req, res, next) => {
    try {
        const userInfo = await getUserInfo(req.user._id);

        res.render("index", {
            user: userInfo
        });

    } catch (err) {
        next(err);
    }
};
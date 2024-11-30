const userModel = require("./../../models/User.model");

exports.showViewEditProfile = async (req, res, next) => {
    try {
        const user = await userModel.findOne({
            _id: req.user._id
        }, "-password");

        res.render("user/edit", {
            user,
        });

    } catch (err) {
        next(err);
    }
};
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

exports.editData = async (req, res, next) => {
    try {
        const {name, email, username} = req.body;
        const userID = req.user._id;

        const isUsernameExists = await userModel.findOne({
            username,
            _id: {
                $ne: userID
            },
        });

        if (isUsernameExists) {
            req.flash("error", "Username already exists.");
            return res.redirect("/user/edit-profile");
        }

        const isEmailExists = await userModel.findOne({
            email,
            _id: {
                $ne: userID
            },
        });

        if (isEmailExists) {
            req.flash("error", "Email already exists.");
            return res.redirect("/user/edit-profile");
        }


        if (req.file) {
            const picturePath = `images/profiles/${req.file.filename}`;

            await userModel.findOneAndUpdate(
                {_id: userID},
                {
                    profilePicture: picturePath,
                }
            );
        }

        await userModel.findOneAndUpdate(
            {_id: userID},
            {
                name,
                email,
                username,
            }
        );

        req.flash("success", "User data saved successfully.");
        res.redirect(`/page/${userID}`);

    } catch (err) {
        next(err);
    }
};
const userModel = require("./../../models/User.model");

exports.getUserInfo = async (req, res, next) => {
    try {
        const user = req.user;

        const userInfo = await userModel.findOne({
            _id: user._id,
        }, "-password");

        res.json({
            user: userInfo,
        });

    } catch (err) {
        next(err);
    }
};

exports.editUserInfo = async (req, res, next) => {
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
            return res.status(409).json({
                message: "Username already exist.",
            });
        }

        const isEmailExists = await userModel.findOne({
            email,
            _id: {
                $ne: userID
            },
        });

        if (isEmailExists) {
            return res.status(409).json({
                message: "Email already exist.",
            });
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

        res.json({
            message: "User info updated successfully.",
        });

    } catch (err) {
        next(err);
    }
};
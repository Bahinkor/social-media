const userModel = require("./../../models/User.model");

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
            return res.status(400).json({
                message: "User already exists!",
            });
        }

        const usersCount = await userModel.countDocuments({});

        await userModel.create({
            email,
            username,
            name,
            password,
            role: +usersCount < 1 ? "ADMIN" : "USER",
        });

        res.status(201).json({
            message: "User created successfully",
        });

    } catch (err) {
        console.log(`auth, register controller failed. error: ${err}`);
        res.status(500).json({
            message: err.message || "Something went wrong.",
        });
    }
};
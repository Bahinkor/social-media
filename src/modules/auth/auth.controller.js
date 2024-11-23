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
            req.flash("error", "User already exists!");
            return res.redirect("/auth/register");

            // return res.status(400).json({
            //     message: "User already exists!",
            // });
        }

        const usersCount = await userModel.countDocuments({});

        await userModel.create({
            email,
            username,
            name,
            password,
            role: +usersCount < 1 ? "ADMIN" : "USER",
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
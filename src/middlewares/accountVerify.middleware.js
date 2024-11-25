const accountVerify = (req, res, next) => {
    try {
        const isVerified = req.user.isVerified;

        if (!isVerified) {
            req.flash("verifyMessage", "You need to verify your account!");
            return res.render("post/upload");
        }

        next();

    } catch (err) {
        console.log(`account verify middleware, error: ${err}`);
        req.flash("error", "Internal Server Error!");
        res.redirect("/post");
    }
};

module.exports = accountVerify;
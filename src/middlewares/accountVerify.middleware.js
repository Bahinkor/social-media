const accountVerify = (req, res, next) => {
    try {
        const isVerified = req.user.isVerified;

        if (!isVerified) {
            return res.status(403).send({
                message: "You need to verify your account!",
            });
        }

        next();

    } catch (err) {
        next(err);
    }
};

module.exports = accountVerify;
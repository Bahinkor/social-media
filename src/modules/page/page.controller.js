exports.getPage = (req, res, next) => {
    try {
        res.render("page/index");

    } catch (err) {
        next(err);
    }
};
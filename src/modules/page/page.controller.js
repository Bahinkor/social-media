const hasAccessToPage = require("../../utils/hasAccessToPage.util");

exports.getPage = async (req, res, next) => {
    try {
        const user = req.user;
        const {pageID} = req.params;

        const hasAccess = await hasAccessToPage(user._id, pageID);

        if (!hasAccess) {
            req.flash("error", "please follow page to show content.");
            return res.render("page/index");
        }

        res.render("page/index");

    } catch (err) {
        next(err);
    }
};
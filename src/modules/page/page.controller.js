const {isValidObjectId} = require("mongoose");
const followModel = require("./../../models/Follow.model");
const hasAccessToPage = require("../../utils/hasAccessToPage.util");

exports.getPage = async (req, res, next) => {
    try {
        const user = req.user;
        const {pageID} = req.params;

        const hasAccess = await hasAccessToPage(user._id, pageID);

        const isValidID = isValidObjectId(pageID);

        if (!isValidID) {
            req.flash("error", "Page ID is not valid!");
            return res.redirect("/");
        }

        const isFollowed = await followModel.findOne({
            follower: user._id,
            following: pageID,
        });

        if (!hasAccess) {
            req.flash("error", "please follow page to show content.");
            return res.render("page/index", {
                followed: Boolean(isFollowed),
                pageID,
            });
        }

        res.render("page/index", {
            followed: Boolean(isFollowed),
            pageID,
        });

    } catch (err) {
        next(err);
    }
};

exports.follow = async (req, res, next) => {
    try {
        res.send("follow ok");

    } catch (err) {
        next(err);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        res.send("unfollow ok");

    } catch (err) {
        next(err);
    }
};
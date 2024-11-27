const {isValidObjectId} = require("mongoose");
const followModel = require("./../../models/Follow.model");
const userModel = require("./../../models/User.model");
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
                followers: false,
            });
        }

        let followers = await followModel.find({
            following: pageID,
        }).populate("follower", "name username");

        followers = followers.map(item => item.follower);

        res.render("page/index", {
            followed: Boolean(isFollowed),
            pageID,
            followers,
        });

    } catch (err) {
        next(err);
    }
};

exports.follow = async (req, res, next) => {
    try {
        const user = req.user;
        const {pageID} = req.params;

        const isValidID = isValidObjectId(pageID);

        if (!isValidID) {
            req.flash("error", "Page ID is not valid!");
            return res.redirect("/");
        }

        const targetPage = await userModel.findOne({
            _id: pageID,
        });

        if (!targetPage) {
            req.flash("error", "Page is not found!");
            return res.redirect(`/page/${pageID}`);
        }

        if (user._id.equals(pageID)) {
            req.flash("error", "you can not follow yourself.");
            return res.redirect(`/page/${pageID}`);
        }

        const existingFollow = await followModel.findOne({
            follower: user._id,
            following: pageID,
        });

        if (existingFollow) {
            req.flash("error", "page already followed.");
            return res.redirect(`/page/${pageID}`);
        }

        await followModel.create({
            follower: user._id,
            following: pageID,
        });

        req.flash("success", "page successfully followed.");
        res.redirect(`/page/${pageID}`);

    } catch (err) {
        next(err);
    }
};

exports.unfollow = async (req, res, next) => {
    try {
        const user = req.user;
        const {pageID} = req.params;

        const isValidID = isValidObjectId(pageID);

        if (!isValidID) {
            req.flash("error", "Page ID is not valid!");
            return res.redirect("/");
        }

        const unFollowedPage = await followModel.findOneAndDelete({
            follower: user._id,
            following: pageID,
        });

        if (!unFollowedPage) {
            req.flash("error", "Page is not found!");
            return res.redirect(`/page/${pageID}`);
        }

        req.flash("success", "page successfully unfollowed.");
        res.redirect(`/page/${pageID}`);

    } catch (err) {
        next(err);
    }
};
const {isValidObjectId} = require("mongoose");
const followModel = require("./../../models/Follow.model");
const userModel = require("./../../models/User.model");
const postModel = require("./../../models/Post.model");
const likeModel = require("./../../models/Like.model");
const saveModel = require("./../../models/Save.model");
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

        const page = await userModel.findOne({
            _id: pageID,
        }, "name username isVerified biography profilePicture").lean();

        if (!page) {
            req.flash("error", "this page is not found.");
            return res.redirect("/");
        }

        const isOwn = user._id.equals(pageID);

        if (!hasAccess) {
            req.flash("error", "please follow page to show content.");
            return res.render("page/index", {
                followed: Boolean(isFollowed),
                pageID,
                followers: false,
                followings: false,
                page,
                posts: false,
                isOwn,
                hasAccess,
            });
        }

        // find followers
        let followers = await followModel.find({
            following: pageID,
        }).populate("follower", "name username profilePicture");

        followers = followers.map(item => item.follower);

        // find followings

        let followings = await followModel.find({
            follower: pageID,
        }).populate("following", "name username profilePicture");

        followings = followings.map(item => item.following);

        // find posts
        const posts = await postModel.find({
            user: pageID,
        }).sort({_id: -1}).populate("user", "name username profilePicture").lean();

        const likes = await likeModel.find({
            user: user._id,
        }).populate("user", "_id").populate("post", "_id").lean();

        const saves = await saveModel.find({
            user: user._id,
        }).populate("user", "_id").populate("post", "_id").lean();

        const likedPostIds = new Set(likes.map(like => like.post._id.toString()));
        const savedPostIds = new Set(saves.map(save => save.post._id.toString()));

        const postWithLike = posts.map(post => ({
            ...post,
            hasLike: likedPostIds.has(post._id.toString()),
            hasSave: savedPostIds.has(post._id.toString()),
        }));

        res.render("page/index", {
            followed: Boolean(isFollowed),
            pageID,
            followers,
            followings,
            page,
            posts: postWithLike,
            isOwn,
            hasAccess,
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
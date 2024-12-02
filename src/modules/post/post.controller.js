const {isValidObjectId} = require("mongoose");
const postModel = require("./../../models/Post.model");
const likeModel = require("../../models/Like.model");
const saveModel = require("../../models/Save.model");
const hasAccessToPage = require("./../../utils/hasAccessToPage.util");
const {getUserInfo} = require("./../../utils/helper");

exports.showPostUploadView = (req, res) => {
    res.render("post/upload");
};

exports.createPost = async (req, res) => {
    try {
        const {description, hashtags} = req.body;
        const user = req.user;

        const hashtagsArray = hashtags.split(",");

        if (!req.file) {
            req.flash("error", "media is required.");
            return res.render("post/upload");
        }

        const mediaUrlPath = `images/posts/${req.file.filename}`;

        await postModel.create({
            media: {
                filename: req.file.filename,
                path: mediaUrlPath,
            },
            description,
            hashtags: hashtagsArray,
            user: user._id,
        });

        req.flash("success", "Post successfully uploaded.");
        res.render("post/upload");

    } catch (err) {
        console.log(`post, create post controller failed. error: ${err}`);
        req.flash("error", "Internal Server Error!");
        res.redirect("/post");
    }
};

exports.like = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;

        const isValidID = isValidObjectId(postID);

        if (!isValidID) {
            req.flash("error", "Post ID is not valid!");
            return res.redirect("back");
        }

        const post = await postModel.findOne({
            _id: postID,
        });

        if (!post) {
            req.flash("error", "Post not found!");
            return res.redirect("back");
        }

        const hasAccess = await hasAccessToPage(user._id, post.user);

        if (!hasAccess) {
            req.flash("error", "your not access this post!");
            return res.redirect("back");
        }

        const isExistingLike = await likeModel.findOne({
            post: postID,
            user: user._id,
        });

        if (isExistingLike) {
            return res.redirect(`/page/${post.user}`);
        }

        await likeModel.create({
            post: postID,
            user: user._id,
        });

        res.redirect(`/page/${post.user}`);

    } catch (err) {
        next(err);
    }
};

exports.dislike = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;

        const isValidPostID = isValidObjectId(postID);

        if (!isValidPostID) {
            req.flash("error", "Post ID is not valid!");
            return res.redirect("back");
        }

        await likeModel.findOneAndDelete({
            post: postID,
            user: user._id,
        });

        res.redirect(`/page/${user._id}`);

    } catch (err) {
        next(err);
    }
};

exports.save = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;

        const isValidPostID = isValidObjectId(postID);

        if (!isValidPostID) {
            req.flash("error", "Post ID is not valid!");
            return res.redirect("back");
        }

        const post = await postModel.findOne({
            _id: postID,
        });

        if (!post) {
            req.flash("error", "Post not found valid!");
            return res.redirect("back");
        }

        const hasAccess = await hasAccessToPage(user._id, post.user);

        if (!hasAccess) {
            req.flash("error", "your not access this post!");
            return res.redirect("back");
        }

        const isExistingSave = await saveModel.findOne({
            post: postID,
            user: user._id,
        });

        if (isExistingSave) {
            return res.redirect(`/page/${post.user}`);
        }

        await saveModel.create({
            post: postID,
            user: user._id,
        });

        res.redirect(`/page/${post.user}`);

    } catch (err) {
        next(err);
    }
};

exports.unsave = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;

        const isValidPostID = isValidObjectId(postID);

        if (!isValidPostID) {
            req.flash("error", "Post ID is not valid!");
            return res.redirect("back");
        }

        const removedSave = await saveModel.findOneAndDelete({
            post: postID,
            user: user._id,
        }).populate("post", "user").lean();

        res.redirect(`/page/${removedSave.post.user}`);

    } catch (err) {
        next(err);
    }
};

exports.showSaveView = async (req, res, next) => {
    try {
        const user = req.user;

        const saves = await saveModel.find({
            user: user._id,
        }).populate("post").lean();

        const likes = await likeModel.find({
            user: user._id,
        }).populate("post").lean();

        const likePostIds = new Set(likes.map(like => like.post._id.toString()));

        const savesWithLike = saves.map(save => ({
            ...save,
            hasLike: likePostIds.has(save.post._id.toString()),
        }));

        const userInfo = await getUserInfo(user._id);

        res.render("post/save", {
            posts: savesWithLike,
            user: userInfo,
        });

    } catch (err) {
        next(err);
    }
};
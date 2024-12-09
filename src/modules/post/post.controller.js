const fs = require("fs");
const path = require("path");
const {isValidObjectId} = require("mongoose");
const postModel = require("./../../models/Post.model");
const likeModel = require("../../models/Like.model");
const saveModel = require("../../models/Save.model");
const commentModel = require("../../models/Comment.model");
const hasAccessToPage = require("./../../utils/hasAccessToPage.util");
const {getUserInfo} = require("./../../utils/helper");

exports.createPost = async (req, res, next) => {
    try {
        const {description, hashtags} = req.body;
        const user = req.user;

        const hashtagsArray = hashtags.split(",");

        if (!req.file) {
            return res.status(422).json({
                message: "Media is required."
            });
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

        res.status(201).json({
            message: "Post uploaded successfully.",
        });

    } catch (err) {
        next(err);
    }
};

exports.like = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.body;

        const isValidID = isValidObjectId(postID);

        if (!isValidID) {
            return res.status(422).json({
                message: "Post ID is not valid!"
            });
        }

        const post = await postModel.findOne({
            _id: postID,
        });

        if (!post) {
            return res.status(404).json({
                message: "Post not found!"
            });
        }

        const hasAccess = await hasAccessToPage(user._id, post.user);

        if (!hasAccess) {
            return res.status(403).json({
                message: "Your not access to this page!"
            });
        }

        const isExistingLike = await likeModel.findOne({
            post: postID,
            user: user._id,
        });

        if (isExistingLike) {
            return res.status(422).json({
                message: "This post already liked!"
            });
        }

        await likeModel.create({
            post: postID,
            user: user._id,
        });

        res.status(201).json({
            message: "Like post successfully.",
        });

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
            return res.status(422).json({
                message: "Post ID is not valid!",
            });
        }

        await likeModel.findOneAndDelete({
            post: postID,
            user: user._id,
        });

        res.json({
            message: "Unlike post successfully.",
        });

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
            return res.status(422).json({
                message: "Post ID is not valid!",
            });
        }

        const post = await postModel.findOne({
            _id: postID,
        });

        if (!post) {
            return res.status(404).json({
                message: "Post is not found!",
            });
        }

        const hasAccess = await hasAccessToPage(user._id, post.user);

        if (!hasAccess) {
            return res.status(403).json({
                message: "Your not access to this page!",
            });
        }

        const isExistingSave = await saveModel.findOne({
            post: postID,
            user: user._id,
        });

        if (isExistingSave) {
            return res.status(422).json({
                message: "This post already saved!",
            });
        }

        await saveModel.create({
            post: postID,
            user: user._id,
        });

        res.status(201).json({
            message: "Post saved successfully.",
        });

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
            return res.status(422).json({
                message: "Post ID is not valid!",
            });
        }

        await saveModel.findOneAndDelete({
            post: postID,
            user: user._id,
        });

        res.json({
            message: "Remove save successfully.",
        });

    } catch (err) {
        next(err);
    }
};

exports.getSavedPosts = async (req, res, next) => {
    try {
        const user = req.user;

        const saves = await saveModel.find({
            user: user._id,
        }).populate({
            path: "post",
            populate: {
                path: "user",
                model: "User",
                select: "name username profilePicture",
            },
        }).sort({_id: -1}).lean();

        const likes = await likeModel.find({
            user: user._id,
        }).populate("post").lean();

        const likePostIds = new Set(likes.map(like => like.post._id.toString()));

        const savesWithLike = saves.map(save => ({
            ...save,
            hasLike: likePostIds.has(save.post._id.toString()),
        }));

        const userInfo = await getUserInfo(user._id);

        res.json({
            posts: savesWithLike,
            user: userInfo,
        });

    } catch (err) {
        next(err);
    }
};

exports.removePost = async (req, res, next) => {
    try {
        const user = req.user;
        const {postID} = req.params;

        const isValidPostID = isValidObjectId(postID);

        if (!isValidPostID) {
            return res.status(422).json({
                message: "Post ID is not valid!",
            });
        }

        const post = await postModel.findOne({
            _id: postID,
        });

        if (!post || !post.user.equals(user._id)) {
            return res.status(422).json({
                message: "Your dont remove this post.",
            });
        }

        await postModel.findOneAndDelete({
            _id: postID,
        });

        await likeModel.deleteMany({
            post: postID,
        });

        await saveModel.deleteMany({
            post: postID,
        });

        await commentModel.deleteMany({
            post: postID,
        });

        const mediaPath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "public",
            "images",
            "posts",
            post.media.filename,
        );

        fs.unlinkSync(mediaPath, err => {
            if (err) next(err);
        });

        res.json({
            message: "Post removed successfully.",
        });

    } catch (err) {
        next(err);
    }
};

exports.newComment = async (req, res, next) => {
    try {
        const user = req.user;
        const {content, parent, postID} = req.body;

        // TODO: isVerified
        // if (!user.isVerified) {
        //     req.flash("error", "You account not verified!");
        //     return res.redirect("back");
        // }

        const isValidPostID = isValidObjectId(postID);

        if (!isValidPostID) {
            return res.status(422).json({
                message: "Post ID is not valid!",
            });
        }

        const post = await postModel.findOne({
            _id: postID,
        });

        if (!post) {
            return res.status(404).json({
                message: "Post is not found!",
            });
        }

        // TODO: parent

        await commentModel.create({
            post: postID,
            user: user._id,
            content,
        });

        res.status(201).json({
            message: "Comment create successfully.",
        });

    } catch (err) {
        next(err);
    }
};
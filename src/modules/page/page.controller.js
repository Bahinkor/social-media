const { isValidObjectId } = require("mongoose");
const followModel = require("./../../models/Follow.model");
const userModel = require("./../../models/User.model");
const postModel = require("./../../models/Post.model");
const likeModel = require("./../../models/Like.model");
const saveModel = require("./../../models/Save.model");
const requestModel = require("./../../models/Request.model");
const hasAccessToPage = require("./../../utils/hasAccessToPage.util");

exports.getPageInfo = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidID = isValidObjectId(pageID);

    if (!isValidID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const hasAccess = await hasAccessToPage(user._id, pageID);

    const isFollowed = await followModel.findOne({
      follower: user._id,
      following: pageID,
    });

    const page = await userModel
      .findOne(
        {
          _id: pageID,
        },
        "name username private biography profilePicture",
      )
      .lean();

    if (!page) {
      return res.status(404).json({
        message: "Page is not found!",
      });
    }

    const isOwn = user._id.equals(pageID);

    if (!hasAccess) {
      return res.status(200).json({
        followed: Boolean(isFollowed),
        pageID,
        page,
        posts: false,
        isOwn,
        hasAccess,
      });
    }

    // find posts
    const posts = await postModel
      .find({
        user: pageID,
      })
      .sort({ _id: -1 })
      .populate("user", "name username profilePicture")
      .lean();

    const likes = await likeModel
      .find({
        user: user._id,
      })
      .populate("user", "_id")
      .populate("post", "_id")
      .lean();

    const saves = await saveModel
      .find({
        user: user._id,
      })
      .populate("user", "_id")
      .populate("post", "_id")
      .lean();

    const likedPostIds = new Set(likes.map((like) => like.post._id.toString()));
    const savedPostIds = new Set(saves.map((save) => save.post._id.toString()));

    const postWithLike = posts.map((post) => ({
      ...post,
      hasLike: likedPostIds.has(post._id.toString()),
      hasSave: savedPostIds.has(post._id.toString()),
    }));

    res.json({
      followed: Boolean(isFollowed),
      pageID,
      page,
      posts: postWithLike,
      isOwn,
      hasAccess,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidID = isValidObjectId(pageID);

    if (!isValidID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const hasAccess = await hasAccessToPage(user._id, pageID);

    if (!hasAccess) {
      return res.status(403).json({
        message: "your not access to this page!",
      });
    }

    // find followers
    let followers = await followModel
      .find({
        following: pageID,
      })
      .populate("follower", "name username profilePicture");

    followers = followers.map((item) => item.follower);

    res.json({
      followers,
    });
  } catch (err) {
    next(err);
  }
};

exports.getFollowings = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidID = isValidObjectId(pageID);

    if (!isValidID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const hasAccess = await hasAccessToPage(user._id, pageID);

    if (!hasAccess) {
      return res.status(403).json({
        message: "your not access to this page!",
      });
    }

    // find followings
    let followings = await followModel
      .find({
        follower: pageID,
      })
      .populate("following", "name username profilePicture");

    followings = followings.map((item) => item.following);

    res.json({
      followings,
    });
  } catch (err) {
    next(err);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidID = isValidObjectId(pageID);

    if (!isValidID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const targetPage = await userModel.findOne({
      _id: pageID,
    });

    if (!targetPage) {
      return res.status(404).json({
        message: "Page is not found!",
      });
    }

    if (user._id.equals(pageID)) {
      return res.status(400).json({
        message: "You can not follow yourself.",
      });
    }

    const existingFollow = await followModel.findOne({
      follower: user._id,
      following: pageID,
    });

    if (existingFollow) {
      return res.status(400).json({
        message: "Page already followed.",
      });
    }

    await followModel.create({
      follower: user._id,
      following: pageID,
    });

    res.status(201).json({
      message: "Page followed successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidID = isValidObjectId(pageID);

    if (!isValidID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const unFollowedPage = await followModel.findOneAndDelete({
      follower: user._id,
      following: pageID,
    });

    if (!unFollowedPage) {
      return res.status(404).json({
        message: "Page is not found!",
      });
    }

    res.json({
      message: "Page unfollowed successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getFollowRequests = async (req, res, next) => {
  try {
    const user = req.user;

    const followRequests = await requestModel
      .find({
        to: user._id,
        status: "pending",
      })
      .populate("to", "-password -__v -createdAt -updateAt")
      .populate("from", "-password -__v -createdAt -updateAt")
      .lean();

    res.json(followRequests);
  } catch (err) {
    next(err);
  }
};

exports.followRequest = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidPageID = isValidObjectId(pageID);

    if (!isValidPageID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    if (user._id.equals(pageID)) {
      return res.status(422).json({
        message: "You can't send a request to yourself.",
      });
    }

    const page = await userModel.findOne({
      _id: pageID,
    });

    if (!page) {
      return res.status(404).json({
        message: "Page not found!",
      });
    }

    const followerAlreadyExist = await followModel.findOne({
      follower: user._id,
      following: pageID,
    });

    if (followerAlreadyExist) {
      return res.status(422).json({
        message: "User already followed this page.",
      });
    }

    await requestModel.create({
      from: user._id,
      to: pageID,
    });

    res.status(201).json({
      message: "Page follow request created successfully.",
    });
  } catch (err) {
    next(err);
  }
};

exports.followRequestAccept = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidPageID = isValidObjectId(pageID);

    if (!isValidPageID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const followRequest = await requestModel.findOneAndUpdate(
      {
        from: pageID,
        to: user._id,
        status: "pending",
      },
      {
        status: "accepted",
      },
    );

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found!",
      });
    }

    await followModel.create({
      follower: user._id,
      following: pageID,
    });

    res.status(201).json({
      message: "Follow request accepted.",
    });
  } catch (err) {
    next(err);
  }
};

exports.followRequestReject = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const isValidPageID = isValidObjectId(pageID);

    if (!isValidPageID) {
      return res.status(422).json({
        message: "Page ID is not valid!",
      });
    }

    const followRequest = await requestModel.findOneAndUpdate(
      {
        from: pageID,
        to: user._id,
        status: "pending",
      },
      {
        status: "rejected",
      },
    );

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found!",
      });
    }

    res.status(200).json({
      message: "Follow request rejected.",
    });
  } catch (err) {
    next(err);
  }
};

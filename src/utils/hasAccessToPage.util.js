const {isValidObjectId} = require("mongoose");
const userModel = require("./../models/User.model");
const followModel = require("./../models/Follow.model");

const hasAccessToPage = async (userID, pageID) => {
    try {
        if (userID.equals(pageID)) return true;

        const isValidID = isValidObjectId(pageID);

        if (!isValidID) return false;

        const page = await userModel.findOne({
            _id: pageID,
        });

        if (!page) return false;

        if (!page.private) return true;

        const isFollowed = await followModel.findOne({
            follower: userID,
            following: pageID,
        });

        if (isFollowed) return true;

        return false;

    } catch (err) {
        console.error(`utils, has access to page error => ${err}`);
    }
};

module.exports = hasAccessToPage;
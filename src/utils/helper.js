const userModel = require("./../models/User.model");

const getUserInfo = async (userID) => {
    return await userModel.findOne({
        _id: userID,
    }, "-password").lean();
};

module.exports = {
    getUserInfo,
}
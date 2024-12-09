const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
}, {timestamps: true});

const model = mongoose.models.Comment || mongoose.model("Comment", schema);

module.exports = model;
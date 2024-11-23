const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expire: {
        type: Date,
        required: true,
    },
}, {timestamps: true});

schema.statics.createToken = async user => {};

schema.statics.verifyToken = async token => {};

const model = mongoose.models.RefreshToken || mongoose.model("RefreshToken", schema);

module.exports = model;
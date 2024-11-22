const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxLength: 200,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 200,
    },
    biography: {
        type: String,
        maxlength: 500,
    },
    name: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 200,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    private: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

// * hashing password
schema.pre("save", async function (next) {
    try {
        this.password = await bcrypt.hash(this.password, 12);
        next();

    } catch (err) {
        console.error(`bcrypt hashing password error: ${err}`);
        next(err);
    }
});

const model = mongoose.models.User || mongoose.model("User", schema);

module.exports = model;
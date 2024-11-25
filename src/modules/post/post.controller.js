const postModel = require("./../../models/Post.model");

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
exports.showPostUploadView = (req, res) => {
    res.render("post/upload");
};

exports.createPost = (req, res) => {
    try {

    } catch (err) {
        console.log(`post, create post controller failed. error: ${err}`);
        req.flash("error", "Internal Server Error!");
        res.redirect("/post");
    }
};
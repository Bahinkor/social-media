const app = require("./app");
const mongoose = require("mongoose");

const port = process.env.PORT || 8000;
const mongodbURI = process.env.MONGODB_URI;

const connectToDB = async () => {
    try {
        await mongoose.connect(mongodbURI);
        console.log("🎉 Connected to DB");

    } catch (err) {
        console.log(`❌ connecting to DB failed: ${err}`);
    }
};

const startServer = () => {
    app.listen(port, () => {
        console.log(`🎉 running server on port: ${port}`);
    });
};

const run = async () => {
    await connectToDB();
    startServer();
};

run();
const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// load env
const isProductionMode = process.env.NODE_ENV === "production";
if (!isProductionMode) {
    dotenv.config();
}

const port = +process.env.PORT || 8000;
const mongodbURI = process.env.MONGODB_URI;

const connectToDB = async () => {
    try {
        await mongoose.connect(mongodbURI);
        console.log(`🎉 Connected to DB: ${mongoose.connection.host}`);

    } catch (err) {
        console.error(`❌ connecting to DB failed: ${err}`);
        process.exit(1);
    }
};

const startServer = () => {
    app.listen(port, () => {
        console.log(`🎉 running server in ${isProductionMode ? "✔️ production" : "🛠️ development"} mode on port: ${port}`);
    });
};

const run = async () => {
    await connectToDB();
    startServer();
};

run();
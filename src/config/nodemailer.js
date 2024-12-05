const nodeMailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = {
    transporter
};
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer_1.default.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            secure: false,
        });
        let info = await transporter.sendMail({
            from: `"RESQ360" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log(info.response);
        return info;
    }
    catch (error) {
        console.log(error.message);
        return { response: error.message };
    }
};
exports.default = mailSender;
//# sourceMappingURL=mailSender.js.map
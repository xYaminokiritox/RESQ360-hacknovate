"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mailSender_1 = __importDefault(require("../utils/mailSender"));
const emailVerificationTemplate_1 = __importDefault(require("../mail/templates/emailVerificationTemplate"));
const OTPSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    },
});
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await (0, mailSender_1.default)(email, "Verification Email", (0, emailVerificationTemplate_1.default)(otp));
        console.log("Email sent successfully: ", mailResponse.response);
    }
    catch (error) {
        console.log("Error occurred while sending email: ", error);
        throw error;
    }
}
OTPSchema.pre("save", async function (next) {
    console.log("New document saved to database");
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});
const OTP = mongoose_1.default.model("OTP", OTPSchema);
exports.default = OTP;
//# sourceMappingURL=OTP.js.map
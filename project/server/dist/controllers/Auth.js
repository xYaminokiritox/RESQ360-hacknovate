"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendotp = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = __importDefault(require("../models/User"));
const OTP_1 = __importDefault(require("../models/OTP"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otp_generator_1 = __importDefault(require("otp-generator"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, contactNumber, otp, } = req.body;
        if (!name ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match. Please try again.",
            });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }
        const response = await OTP_1.default.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(response);
        if (response.length === 0) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        else if (otp !== response[0].otp) {
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({
            name,
            email,
            contactNumber,
            password: hashedPassword,
        });
        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }
        if (await bcrypt_1.default.compare(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET || '', {
                expiresIn: "24h",
            });
            user.token = token;
            user.password = '';
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            return res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
};
exports.login = login;
const sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUserPresent = await User_1.default.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            });
        }
        let otp = (0, otp_generator_1.default)(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const result = await OTP_1.default.findOne({ otp: otp });
        console.log("Result is Generate OTP Func");
        console.log("OTP", otp);
        console.log("Result", result);
        while (result) {
            otp = (0, otp_generator_1.default)(6, {
                upperCaseAlphabets: false,
            });
        }
        const otpPayload = { email, otp };
        const otpBody = await OTP_1.default.create(otpPayload);
        console.log("OTP Body", otpBody);
        return res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};
exports.sendotp = sendotp;
//# sourceMappingURL=Auth.js.map
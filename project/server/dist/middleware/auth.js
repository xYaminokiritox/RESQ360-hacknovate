"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = req.cookies.token ||
            req.body.token ||
            ((_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", ""));
        if (!token) {
            res.status(401).json({ success: false, message: `Token Missing` });
            return;
        }
        try {
            const decode = await jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            console.log(decode);
            req.user = decode;
            next();
        }
        catch (error) {
            res.status(401).json({ success: false, message: "token is invalid" });
        }
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: `Something Went Wrong While Validating the Token`,
        });
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map
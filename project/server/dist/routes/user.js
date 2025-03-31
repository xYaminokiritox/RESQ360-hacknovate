"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = require("../controllers/Auth");
const router = express_1.default.Router();
router.post("/login", Auth_1.login);
router.post("/signup", Auth_1.signup);
router.post("/sendotp", Auth_1.sendotp);
exports.default = router;
//# sourceMappingURL=user.js.map
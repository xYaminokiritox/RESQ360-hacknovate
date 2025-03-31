"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { MONGODB_URL } = process.env;
const connect = () => {
    if (!MONGODB_URL) {
        console.log('MONGODB_URL is not defined in environment variables');
        process.exit(1);
    }
    mongoose_1.default
        .connect(MONGODB_URL)
        .then(() => console.log(`DB Connection Success`))
        .catch((err) => {
        console.log(`DB Connection Failed`);
        console.log(err);
        process.exit(1);
    });
};
exports.default = { connect };
//# sourceMappingURL=database.js.map
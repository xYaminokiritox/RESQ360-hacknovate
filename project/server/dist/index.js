"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const database_1 = __importDefault(require("./config/database"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
dotenv_1.default.config();
database_1.default.connect();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use("/", user_1.default);
app.get("/", (_req, res) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
//# sourceMappingURL=index.js.map
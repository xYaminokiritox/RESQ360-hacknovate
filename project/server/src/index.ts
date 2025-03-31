import express, { Request, Response } from 'express';
import userRoutes from './routes/user';
import database from './config/database';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Setting up port number
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

// Setting up routes
app.use("/", userRoutes);

// Testing the server
app.get("/", (_req: Request, res: Response) => {
    return res.json({
        success: true,
        message: "Your server is up and running ...",
    });
});

// Listening to the server
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
}); 
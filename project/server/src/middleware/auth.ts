import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configuring dotenv to load environment variables from .env file
dotenv.config();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
      };
    }
  }
}

// This function is used as middleware to authenticate user requests
export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      res.status(401).json({ success: false, message: `Token Missing` });
      return;
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = await jwt.verify(token, process.env.JWT_SECRET || '') as { email: string; id: string };
      console.log(decode);
      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
      next();
    } catch (error) {
      // If JWT verification fails, return 401 Unauthorized response
      res.status(401).json({ success: false, message: "token is invalid" });
    }
  } catch (error) {
    // If there is an error during the authentication process, return 401 Unauthorized response
    res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
}; 
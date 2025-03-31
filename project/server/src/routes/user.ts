import express, { Router } from 'express';
import {
  login,
  signup,
  sendotp,
} from '../controllers/Auth';

const router: Router = express.Router();

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp);

export default router; 
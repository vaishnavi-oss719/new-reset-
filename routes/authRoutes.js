import express from "express";
// import { register, login, forgotPassword, resetPassword } from './controllers/authController.js';
import { register,login,forgotPassword,resetPassword,updateEmail } from "../Controllers/authController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);
router.put("/update-email/:userId", updateEmail);

export default router;
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
// };

// // REGISTER
// export const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const userExists = await User.findOne({ email });
//   if (userExists)
//     return res.status(400).json({ message: "User already exists" });

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });

//   res.status(201).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//   });
// };

// // LOGIN
// export const login = async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user)
//     return res.status(400).json({ message: "Invalid credentials" });

//   const match = await bcrypt.compare(password, user.password);
//   if (!match)
//     return res.status(400).json({ message: "Invalid credentials" });

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     token: generateToken(user._id),
//   });
// };

// // FORGOT PASSWORD
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   const user = await User.findOne({ email });
//   if (!user)
//     return res.status(404).json({ message: "User not found" });

//   const resetToken = crypto.randomBytes(32).toString("hex");

//   user.resetToken = resetToken;
//   user.resetTokenExpire = Date.now() + 60 * 60 * 1000;
//   await user.save();

//   const transporter = nodemailer.createTransport({
//      host: "smtp.gmail.com",
//      port: 587,
//     secure: false, // IMPORTANT
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: {
//     ciphers: "SSLv3",
//     rejectUnauthorized: false,
//   },
//   });

//   const resetURL = `${process.env.CLIENT_URL}/reset/${resetToken}`;

//   await axios.post(
//   "https://api.brevo.com/v3/smtp/email",
//   {
//     sender: {
//       name: "Reset Support",
//       email: "your_verified_email@gmail.com",
//     },
//     to: [
//       {
//         email: user.email,
//       },
//     ],
//     subject: "Password Reset",
//     htmlContent: `
//       <h3>Click below to reset password</h3>
//       <a href="${resetURL}">${resetURL}</a>
//     `,
//   },
//   {
//     headers: {
//       "api-key": process.env.BREVO_API_KEY,
//       "Content-Type": "application/json",
//     },
//   }
// );

//   res.json({ message: "Reset link sent to email" });
// };

// // RESET PASSWORD
// export const resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   const user = await User.findOne({
//     resetToken: token,
//     resetTokenExpire: { $gt: Date.now() },
//   });

//   if (!user)
//     return res.status(400).json({ message: "Token expired or invalid" });

//   user.password = await bcrypt.hash(password, 10);
//   user.resetToken = undefined;
//   user.resetTokenExpire = undefined;

//   await user.save();

//   res.json({ message: "Password reset successful" });
// };




// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 60 * 60 * 1000; // 1hr
    await user.save();

 const resetURL = `http://localhost:5173/reset/${resetToken}`;

    // 🔥 Send Email using Brevo
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Reset Support",
          email: "rv172542@gmail.com", // verify in Brevo
        },
        to: [{ email: user.email }],
        subject: "Password Reset",
        htmlContent: `
          <h3>Password Reset Request</h3>
          <p>Click below to reset your password:</p>
          <a href="${resetURL}">${resetURL}</a>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Email sending failed" });
  }
};



// update email

export const updateEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.email = email;
    await user.save();

    res.json({ message: "Email updated successfully", email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
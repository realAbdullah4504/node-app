const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../helpers/email");
const User = require("../models/auth.model");


const JWT_SECRET = "this_is_my_secret_key";
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  console.log(isPasswordValid,bcrypt.decodeBase64(user.password))
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (!user.isVerified) {
    return res.status(401).json({ message: "Email not verified" });
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    token,
    refreshToken,
    user: { id: user._id, email: user.email },
  });
});

router.get("/protected", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user=await User.findById(decoded.id)  
    res.json({ message: "Protected content", userId: decoded.id, user });
  });
});

router.post("/register", async (req, res) => {
    console.log(req.body.username,req.body.password,req.body.email)
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res
      .status(400)
      .json({ message: "Username, password and email are required" });
  }
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const emailToken = crypto.randomBytes(32).toString("hex");
  const verificationLink = `http://localhost:3000/verify-email?token=${emailToken}`;
  await sendMail(email, "Verify your email", verificationLink);
  const user = new User({ username,email, password: hashedPassword, emailToken });
  await user.save();
  res.json({ message: "User registered successfully" });
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  const user = await User.findOne({ emailToken: token });
  if (!user) {
    return res.status(400).json({ message: "Invalid token" });
  }
  user.isVerified = true;
  await user.save();
  res.json({ message: "Email verified successfully" });
});

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  jwt.verify(refreshToken, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const user=await User.findById(decoded.id)
    const token = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token,user });
  });
});

module.exports = router;

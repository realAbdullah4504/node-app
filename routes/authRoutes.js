const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendMail = require("../helpers/email");

const JWT_SECRET = "this_is_my_secret_key";

let user = {
  id: 1,
  username: "admin",
  password: bcrypt.hashSync("password", 8), // hashed password
  emailToken: crypto.randomBytes(32).toString("hex"),
  isVerified: false,
};

router.get("/", (req, res) => {
  res.json("Hello World!");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  if (!user.isVerified) {
    return res.status(401).json({ message: "Email not verified" });
  }
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
  const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, refreshToken, user: { id: user.id, username: user.username } });
});

router.get("/protected", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "Protected content", userId: decoded.id, user: user });
  });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const email = 'abdullahjaved4504@gmail.com';
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  const emailToken = crypto.randomBytes(32).toString("hex");
  const verificationLink = `http://localhost:3000/verify-email?token=${emailToken}`;
  await sendMail(email, "Verify your email", verificationLink);
  const newUser = { id: Date.now(), username, password: hashedPassword, emailToken, isVerified: false };
  user = newUser;
  res.json(newUser);
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  if (token !== user.emailToken) {
    return res.status(400).json({ message: "Invalid token" });
  }
  user.isVerified = true;
  res.json({ message: "Email verified successfully" });
});

router.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  jwt.verify(refreshToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });
});


module.exports = router;

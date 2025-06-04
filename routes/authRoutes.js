const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const user = {
  id: 1,
  username: "admin",
  password: "password",
};

router.get("/", (req, res) => {
  return res.json("Hello World!");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ id: user.id }, "secretKey");
    res.json({ message: "Login successful!", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;

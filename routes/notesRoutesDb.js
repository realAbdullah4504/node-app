const express = require("express");
const Note = require("../models/notes.model");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "this_is_my_secret_key";
router.get("/", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const user = jwt.verify(token, JWT_SECRET);
  const notes = await Note.find({ userId: user.id });
  res.json(notes);
});

router.post("/", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const user = jwt.verify(token, JWT_SECRET);
  const note = new Note({
    title: req.body.title,
    description: req.body.description,
    userId: user.id,
  });
  await note.save();
  res.status(201).json(note);
});
router.delete("/:id", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const user = jwt.verify(token, JWT_SECRET);
  const note = await Note.findByIdAndDelete(req.params.id);
  res.json(note);
});

router.put("/:id", async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  const user = jwt.verify(token, JWT_SECRET);
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(note);
});

module.exports = router;

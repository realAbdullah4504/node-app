const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const notes = [
  {
    id: 1,
    title: "Note 1",
    userId: 1,
    description: "Description 1",
  },
  {
    id: 2,
    title: "Note 2",
    userId: 1,
    description: "Description 2",
  },
  {
    id: 3,
    title: "Note 3",
    userId: 1,
    description: "Description 3",
  },
];
router.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log(token,"token");
  const decodedToken = jwt.verify(token, "secretKey");
  console.log(decodedToken,"decodedToken");
  const notesData = notes.filter((note) => note.userId === decodedToken.id);
  res.json(notesData);
});

router.post("/", async (req, res) => {
  const note = {
    id: Date.now(),
    title: req.body.title,
    userId: req.body.userId,
    description: req.body.description,
  };
  notes.push(note);
  res.status(201).json(note);
});
router.delete("/:id", async (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  notes = notes.filter((note) => note.id !== parseInt(req.params.id));
  res.json(note);
});

router.put("/:id", async (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  note.title = req.body.title;
  note.description = req.body.description;
  res.json(note);
});

module.exports = router;

const express = require("express");
const router = express.Router();

const notes = [
  {
    id: 1,
    title: "Note 1",
    description: "Description 1",
  },
  {
    id: 2,
    title: "Note 2",
    description: "Description 2",
  },
  {
    id: 3,
    title: "Note 3",
    description: "Description 3",
  },
];

router.get("/", async (req, res) => {
  res.json(notes);
});

router.post("/", async (req, res) => {
  const note = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
  };
  notes.push(note);
  res.status(201).json(note);
});
router.delete("/:id", async (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  res.json(note);
});

router.put("/:id", async (req, res) => {
  const note = notes.find((note) => note.id === parseInt(req.params.id));
  res.json(note);
});

module.exports = router;

const express = require('express');
const Note = require('../models/notes.model');
const router = express.Router();

router.get('/', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

router.post('/', async (req, res) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content
    });
    await note.save();
    res.status(201).json(note);
})
router.delete('/:id', async (req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id);
    res.json(note);
});

router.put('/:id', async (req, res) => {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
});


module.exports = router;
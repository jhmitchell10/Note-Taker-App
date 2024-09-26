const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Read notes from db.json
router.get('/notes', (req, res) => {
  fs.readFile(path.join(__dirname, '../db.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    res.json(JSON.parse(data));
  });
});

// Save a new note to db.json
router.post('/notes', (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  fs.readFile(path.join(__dirname, '../db.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, '../db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

// Delete a note by ID
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, '../db.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id !== noteId);

    fs.writeFile(path.join(__dirname, '../db.json'), JSON.stringify(notes), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete note' });
      }
      res.json({ message: 'Note deleted' });
    });
  });
});

module.exports = router;

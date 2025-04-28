const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todos.db');

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to include static content
app.use(express.static('public'));

// Using database to store todo items
db.run(`CREATE TABLE IF NOT EXISTS todos
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            priority TEXT DEFAULT 'low',
            isComplete BOOLEAN DEFAULT 0,
            isFun BOOLEAN DEFAULT 1
        )`);

// server index.html
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// GET all todo items
app.get('/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
            res.status(500).json({message: 'Database error'});
            return;
        }
        res.json(rows);
    });
});

//GET a specific todo item by ID
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({message: 'Database error'});
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({message: 'Todo item not found'});
        }
    });
});

// POST a new todo item
app.post('/todos', (req, res) => {
    const {name, priority = 'low', isFun = true} = req.body;
    if (!name) {
        return res.status(400).json({message: 'Name is required'});
    }

    const dbInsert = db.prepare('INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, 0, ?)');
    dbInsert.run(name, priority, isFun, function (err) {
        if (err) {
            res.status(500).json({message: 'Database error'});
            return;
        }
        res.status(201).json({id: this.lastID, name, priority, isComplete: false, isFun});
    });
});

// DELETE a todo item by ID
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.run('DELETE FROM todos WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({message: 'Database error'});
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({message: 'Todo item not found'});
        } else {
            res.json({message: `Todo item ${id} deleted.`});
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Todo API server running at http://localhost:${port}`);
});

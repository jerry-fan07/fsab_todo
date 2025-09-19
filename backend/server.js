const express = require('express');
const cors = require('cors');
const db = require('./firebase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todosSnapshot = await db.collection('todos').get();
    const todos = [];
    todosSnapshot.forEach(doc => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    const todoRef = await db.collection('todos').add({
      text,
      completed: false,
      createdAt: new Date()
    });
    res.json({ id: todoRef.id, text, completed: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    await db.collection('todos').doc(id).update({ completed });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('todos').doc(id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
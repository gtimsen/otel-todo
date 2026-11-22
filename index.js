const express = require('express');
const { MongoClient } = require('mongodb');

const PORT = 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';

const app = express();
const client = new MongoClient(MONGO_URL);
let todos;

app.get('/todo', async (req, res) => {
  const all = await todos.find({}).toArray();
  res.json(all);
});

app.get('/todo/:id', async (req, res) => {
  const todo = await todos.findOne({ id: Number(req.params.id) });
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.json(todo);
});

async function startServer() {
  await client.connect();
  todos = client.db('todo').collection('todos');

  await todos.deleteMany({});
  await todos.insertMany([
    { id: 1, title: 'Install Docker', done: true },
    { id: 2, title: 'Run Jaeger', done: true },
    { id: 3, title: 'Review traces in Jaeger UI', done: false },
    { id: 4, title: 'Write telemetry summary', done: false },
  ]);

  app.listen(PORT, () => {
    console.log(`Todo service listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
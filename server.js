const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Настройка базы данных
const DB_FILE = path.join(__dirname, 'db.json');
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '{}');
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API endpoints
app.post('/save', (req, res) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(req.body));
  res.sendStatus(200);
});

app.get('/load', (req, res) => {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  res.json(JSON.parse(data || '{}'));
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
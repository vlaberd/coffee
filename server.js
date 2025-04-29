const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const DB_FILE = path.join(__dirname, 'db.json');

// Улучшенная инициализация базы
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '{}', 'utf-8');
  console.log('База данных создана');
} else {
  console.log('Существующая база:', fs.readFileSync(DB_FILE, 'utf-8'));
}

app.use(express.json());
app.use(express.static('public'));

// Фиксированный обработчик сохранения
app.post('/save', (req, res) => {
  try {
    if (!req.body) throw new Error('Нет данных');
    
    fs.writeFileSync(DB_FILE, JSON.stringify(req.body, null, 2), 'utf-8');
    console.log('Сохранено:', req.body);
    res.status(200).json({success: true});
  } catch (error) {
    console.error('Ошибка сохранения:', error);
    res.status(500).json({error: error.message});
  }
});

// Фиксированный обработчик загрузки
app.get('/load', (req, res) => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8') || '{}';
    console.log('Загружено:', data);
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    res.status(500).json({error: error.message});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`));
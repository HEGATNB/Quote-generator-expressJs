require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ВРЕМЕННО комментируем кастомные модули
// const logger = require('./src/middleware/logger');
// app.use(logger);

// const quotesRouter = require('./src/routes/quotes');
// app.use('/api/quotes', quotesRouter);

// Вместо этого - тестовый маршрут API
app.get('/api/quotes/random', (req, res) => {
  res.json({
    id: 999,
    text: "Тестовая цитата для проверки API",
    author: "Система",
    category: "Тест"
  });
});

app.get('/api/quotes', (req, res) => {
  res.json({
    total: 1,
    page: 1,
    quotes: [{
      id: 999,
      text: "Тестовая цитата",
      author: "Система",
      category: "Тест"
    }]
  });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Сервер работает',
    timestamp: new Date().toISOString()
  });
});

try {
  app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`✅ Проверьте: http://localhost:${PORT}/health`);
  });
} catch (error) {
  console.error('❌ Ошибка запуска сервера:', error);
  process.exit(1);
}
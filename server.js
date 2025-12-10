require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const logger = require('./src/middleware/logger');
app.use(logger);

const quotesRouter = require('./src/routes/quotes');
app.use('/api/quotes', quotesRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так!' });
});

app.listen(port, () => {
  console.log(`Откройте http://localhost:${port}`);
});
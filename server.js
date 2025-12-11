
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const logger = require('./src/middleware/logger');
const quotesRouter = require('./src/routes/quotes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(express.static('public'));

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

const port = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';


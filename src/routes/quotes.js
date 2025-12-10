const express = require('express');
const router = express.Router();
const quotesController = require('../controllers/quotesController');

router.get('/', quotesController.getAllQuotes);

router.get('/random', quotesController.getRandomQuote);

router.get('/:id', quotesController.getQuoteById);

router.post('/', quotesController.createQuote);

router.put('/:id', quotesController.updateQuote);

router.delete('/:id', quotesController.deleteQuote);

router.get('/author/:authorName', quotesController.getQuotesByAuthor);

router.get('/category/search', quotesController.getQuotesByCategory);

module.exports = router;
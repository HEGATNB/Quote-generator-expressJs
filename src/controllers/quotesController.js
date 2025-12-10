const fs = require('fs').promises;
const path = require('path');

const quotesFilePath = path.join(__dirname, '../data/quotes.json');

const readQuotesFile = async () => {
  try {
    const data = await fs.readFile(quotesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeQuotesFile = async (quotes) => {
  await fs.writeFile(quotesFilePath, JSON.stringify(quotes, null, 2), 'utf8');
};

exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await readQuotesFile();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = quotes.slice(startIndex, endIndex);

    res.json({
      total: quotes.length,
      page,
      limit,
      totalPages: Math.ceil(quotes.length / limit),
      quotes: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при чтении цитат' });
  }
};

exports.getRandomQuote = async (req, res) => {
  try {
    const quotes = await readQuotesFile();

    if (quotes.length === 0) {
      return res.status(404).json({ error: 'Цитаты не найдены' });
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    res.json(quotes[randomIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении случайной цитаты' });
  }
};

exports.getQuoteById = async (req, res) => {
  try {
    const quotes = await readQuotesFile();
    const quote = quotes.find(q => q.id === parseInt(req.params.id));

    if (!quote) {
      return res.status(404).json({ error: 'Цитата не найдена' });
    }

    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске цитаты' });
  }
};

exports.createQuote = async (req, res) => {
  try {
    const { text, author, category = 'Разное' } = req.body;

    if (!text || !author) {
      return res.status(400).json({
        error: 'Поля "text" и "author" обязательны'
      });
    }

    const quotes = await readQuotesFile();

    const newQuote = {
      id: quotes.length > 0 ? Math.max(...quotes.map(q => q.id)) + 1 : 1,
      text,
      author,
      category,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    quotes.push(newQuote);
    await writeQuotesFile(quotes);

    res.status(201).json(newQuote);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании цитаты' });
  }
};

exports.updateQuote = async (req, res) => {
  try {
    const quotes = await readQuotesFile();
    const quoteIndex = quotes.findIndex(q => q.id === parseInt(req.params.id));

    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Цитата не найдена' });
    }

    const updatedQuote = {
      ...quotes[quoteIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    quotes[quoteIndex] = updatedQuote;
    await writeQuotesFile(quotes);

    res.json(updatedQuote);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении цитаты' });
  }
};

exports.deleteQuote = async (req, res) => {
  try {
    const quotes = await readQuotesFile();
    const quoteIndex = quotes.findIndex(q => q.id === parseInt(req.params.id));

    if (quoteIndex === -1) {
      return res.status(404).json({ error: 'Цитата не найдена' });
    }

    const deletedQuote = quotes.splice(quoteIndex, 1);
    await writeQuotesFile(quotes);

    res.json({
      message: 'Цитата удалена',
      quote: deletedQuote[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении цитаты' });
  }
};

exports.getQuotesByAuthor = async (req, res) => {
  try {
    const quotes = await readQuotesFile();
    const authorName = req.params.authorName.toLowerCase();

    const filteredQuotes = quotes.filter(
      q => q.author.toLowerCase().includes(authorName)
    );

    res.json({
      author: req.params.authorName,
      count: filteredQuotes.length,
      quotes: filteredQuotes
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске цитат по автору' });
  }
};

exports.getQuotesByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        error: 'Не указан параметр category'
      });
    }

    const quotes = await readQuotesFile();
    const filteredQuotes = quotes.filter(
      q => q.category.toLowerCase().includes(category.toLowerCase())
    );

    res.json({
      category,
      count: filteredQuotes.length,
      quotes: filteredQuotes
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при поиске цитат по категории' });
  }
};
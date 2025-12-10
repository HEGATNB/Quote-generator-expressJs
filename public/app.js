const API_URL = '/api/quotes';

async function getRandomQuote() {
    try {
        const response = await fetch(`${API_URL}/random`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quote = await response.json();

        const quoteElement = document.getElementById('randomQuote');
        quoteElement.innerHTML = `
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
            <p class="quote-category">Категория: ${quote.category}</p>
        `;
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при получении цитаты: ' + error.message);
    }
}

async function getAllQuotes() {
    try {
        const page = document.getElementById('page').value;
        const limit = document.getElementById('limit').value;

        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const container = document.getElementById('quotesContainer');
        container.innerHTML = '';

        if (data.quotes.length === 0) {
            container.innerHTML = '<p>Цитаты не найдены</p>';
            return;
        }

        data.quotes.forEach(quote => {
            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote-card';
            quoteElement.innerHTML = `
                <p class="quote-text">"${quote.text}"</p>
                <p class="quote-author">— ${quote.author}</p>
                <p class="quote-category">Категория: ${quote.category} • ID: ${quote.id}</p>
            `;
            container.appendChild(quoteElement);
        });

        // Показать информацию о пагинации
        const info = document.createElement('p');
        info.innerHTML = `Страница ${data.page} из ${data.totalPages} (Всего цитат: ${data.total})`;
        container.insertBefore(info, container.firstChild);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при загрузке цитат: ' + error.message);
    }
}

document.getElementById('addQuoteForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const text = document.getElementById('quoteText').value;
    const author = document.getElementById('quoteAuthor').value;
    const category = document.getElementById('quoteCategory').value || 'Разное';

    if (!text.trim() || !author.trim()) {
        alert('Пожалуйста, заполните текст цитаты и автора');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, author, category })
        });

        if (response.ok) {
            const newQuote = await response.json();
            alert(`Цитата добавлена! ID: ${newQuote.id}`);
            this.reset();
            // Обновить список цитат
            getAllQuotes();
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error || 'Неизвестная ошибка'}`);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при добавлении цитаты: ' + error.message);
    }
});

async function searchByAuthor() {
    const author = document.getElementById('searchAuthor').value;
    if (!author.trim()) {
        alert('Введите автора для поиска');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/author/${encodeURIComponent(author)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        displaySearchResults(data);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при поиске: ' + error.message);
    }
}

async function searchByCategory() {
    const category = document.getElementById('searchCategory').value;
    if (!category.trim()) {
        alert('Введите категорию для поиска');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/category/search?category=${encodeURIComponent(category)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        displaySearchResults(data);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при поиске: ' + error.message);
    }
}

function displaySearchResults(data) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (!data.quotes || data.quotes.length === 0) {
        container.innerHTML = '<p>Ничего не найдено</p>';
        return;
    }

    const title = document.createElement('h3');
    if (data.author) {
        title.textContent = `Результаты поиска по автору: ${data.author} (найдено: ${data.count})`;
    } else if (data.category) {
        title.textContent = `Результаты поиска по категории: ${data.category} (найдено: ${data.count})`;
    }
    container.appendChild(title);

    data.quotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote-card';
        quoteElement.innerHTML = `
            <p class="quote-text">"${quote.text}"</p>
            <p class="quote-author">— ${quote.author}</p>
            <p class="quote-category">Категория: ${quote.category} • ID: ${quote.id}</p>
        `;
        container.appendChild(quoteElement);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена, загружаю цитаты...');
    getAllQuotes();
    testAPI();
});

async function testAPI() {
    try {
        const response = await fetch(`${API_URL}/random`);
        console.log('Тест API random:', response.status, response.ok);
    } catch (error) {
        console.error('Тест API не прошел:', error);
    }
}
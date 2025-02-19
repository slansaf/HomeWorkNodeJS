const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const viewsFilePath = path.join(__dirname, 'views.json');

// Функция для загрузки счетчика из файла
function loadViews() {
    if (fs.existsSync(viewsFilePath)) {
        const data = fs.readFileSync(viewsFilePath, 'utf-8');
        return JSON.parse(data);
    }
    return { index: 0, about: 0 }; 
}

// Функция для сохранения счетчика в файл
function saveViews(views) {
    try {
        fs.writeFileSync(viewsFilePath, JSON.stringify(views, null, 2));
    } catch (error) {
        console.error('Ошибка при сохранении счетчиков:', error);
    }
}


// Загружаем счетчики при старте сервера
let views = loadViews();

// app.use(express.static('static'));

app.get('/', (req, res) => {
    views.index += 1; // Увеличиваем счетчик просмотров для главной страницы
    saveViews(views); // Сохраняем обновленный счетчик
    console.log(`Счетчик главной страницы: ${views.index}`);
    res.send(`
         <h1>Приветствую на главной странице сайта</h1>
    <p>Количество просмотров этой страницы: ${views.index}</p>
    <a href="/">Главная</a>
    <a href="/abuot">Обо мне</a>
        
        `);
});

app.get('/abuot', (req, res) => {
    views.about += 1; // Увеличиваем счетчик просмотров для страницы "О нас"
    saveViews(views); // Сохраняем обновленный счетчик
    console.log(`Счетчик страницы "О нас": ${views.about}`);
   res.send(`
     <h1>Приветствую странице обомне</h1>
    <p>Количество просмотров этой страницы: ${views.about}</p>
    <a href="/">Главная</a>
    <a href="/abuot">Обо мне</a>
    `);
});

app.get('/views', (req, res) => {
    res.json(views); // Возвращаем текущее значение счетчиков в формате JSON
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

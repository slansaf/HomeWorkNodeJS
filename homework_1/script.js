const http = require('http');
function pageCounter() {
	let count = 0;
	return {
		increment: () => {
			count++;
		},
		getCount: ()=> {
			return count;
		}
	}
}

const homePageCounter = pageCounter();
const aboutPageCounter = pageCounter();

const server = http.createServer((req, res) =>{
	console.log('Запрос получен');
	if (req.url === '/') {
		homePageCounter.increment();
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=UTF-8',
		});
		res.end(`
			<h1>Добпро пожаловать на сайт!</h1> 
			<p> Количество просмотров страницы ${homePageCounter.getCount()}</p>
			`);
		
	} else if (req.url === '/about') {
		aboutPageCounter.increment();
		res.writeHead(200, {
			'Content-Type': 'text/html; charset=UTF-8',
		});
		res.end(`<h1>Вторя страница About</h1>
			<p> Количество просмотров страницы ${aboutPageCounter.getCount()}</p>
			`);
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/html; charset=UTF-8',
		});
		res.end('<h1>Страница не найдена!</h1>');
	}
});

const port = 3000;

server.listen(port, () => {
	console.log(`Сервер запущен на порту ${port}`);
});
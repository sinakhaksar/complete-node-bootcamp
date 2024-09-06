const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');
//
const replaceTemplate = require('./modules/replaceTemplate');
/////////////////////////////////////////////////// Files
// Blocking way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `this is what we know about avocado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written!');

// non blocking way

// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
// 	fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
// 		console.log(data2);
// 		fs.readFile('./starter/txt/append.txt', 'utf-8', (err, data3) => {
// 			console.log(data3);
// 			fs.writeFile(
// 				'./starter/txt/final.txt',
// 				`${data2} \n${data3}`,
// 				'utf-8',
// 				err => {
// 					console.log('file has been written ✅✅');
// 				},
// 			);
// 		});
// 	});
// });
// console.log('will read file');

/////////////////////////////////////////////////// Data & Templates
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8',
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8',
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8',
);

const slugs = dataObject.map(el => slugify(el.productName, { lower: true }));

/////////////////////////////////////////////////// SERVER & ROUTING
const server = http.createServer((req, res) => {
	console.log(req.url);
	const { query, pathname } = url.parse(req.url, true);

	// const pathname = req.url;
	//OVERVIEW page
	if (pathname === '/' || pathname === '/overview') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});
		const cardsHtml = dataObject
			.map(el => replaceTemplate(tempCard, el))
			.join('');
		const output = tempOverview.replace('{%PRODUCT-CARDS%}', cardsHtml);

		res.end(output);

		// products
	} else if (pathname === '/product') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});
		const product = dataObject[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);

		// api
	} else if (pathname === '/api') {
		// api
		res.writeHead(200, {
			'Content-type': 'application/json',
		});
		res.end(data);

		// not found
	} else {
		res.writeHead(404, {
			'Content-type': 'text/html',
			'My-own-header': 'Hello world',
		});

		res.end('<h1>404 Not found</h1>');
	}
});

server.listen(8585, '127.0.0.1', () => {
	console.log('server Listening on poert 8585');
});

const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
	constructor() {
		super();
	}
}
const myEmitter = new Sales();

myEmitter.on('newSale', () => {
	console.log('There was a new sale');
});

myEmitter.on('newSale', () => {
	console.log('Coustumer name: sina');
});
myEmitter.on('newSale', stock => console.log(`There are ${stock} left`));
// its like clicking a butten
myEmitter.emit('newSale', 9);
//////////////
console.log('-----------------------------');

const server = http.createServer();

server.on('request', (req, res) => {
	console.log('Request resived');
	console.log(req.url);

	res.end('request resived');
});

server.on('request', (req, res) => {
	console.log('Another req');
});

server.on('closed', (req, res) => {
	console.log('server Closed');
});

server.listen(8000, '127.0.0.1', () => console.log('waiting for requests'));

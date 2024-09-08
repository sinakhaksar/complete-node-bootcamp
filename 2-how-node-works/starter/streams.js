const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
	// solution one

	// fs.readFile('test-file.txt', (err, data) => {
	// 	if (err) console.log(err);
	// 	res.end(data);
	// });

	// solution 2
	// const readale = fs.createReadStream('test-file.txt');

	// readale.on('data', chunch => {
	// 	res.write(chunch);
	// });
	// readale.on('end', () => res.end());
	// readale.on('error', error => {
	// 	console.log(error);
	// 	res.statusCode = 500;
	// 	res.end('FILE NOT FOUND');
	// });

	// solution 3
	const readale = fs.createReadStream('test-file.txt');
	readale.pipe(res);
	// readable source .pipe(writable destanation)
});

server.listen(8000, 'localhost', () => {
	console.log('Listening on port 8000');
});

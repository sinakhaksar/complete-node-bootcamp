setTimeout(() => {
	console.log('timer');
}, 0);

console.log('Global');

Promise.resolve().then(() => console.log('Promise resolved'));

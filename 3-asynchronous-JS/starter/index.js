const { error } = require('console');
const fs = require('fs');
const { get } = require('http');
const superagent = require('superagent');

const readFilePro = file => {
	return new Promise((res, rej) => {
		fs.readFile(file, (err, data) => {
			if (err) {
				rej(`File Not Found`);
			}
			res(data);
		});
	});
};
const writeFilePro = (file, data) => {
	return new Promise((res, rej) => {
		fs.writeFile(file, data, err => {
			if (err) rej(`Could Not Write File`);
			res('Success');
		});
	});
};

/*
readFilePro(`${__dirname}/dog.txt`)
	.then(data => {
		console.log(`Bread: ${data}`);
		return superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`,
		);
	})
	.then(res => {
		console.log('GOT the photo');
		return writeFilePro('dog-img.txt', res.body.message);
	})
	.then(() => console.log('Radom dog image saved to file'))
	.catch(err => console.error('🔴 Error: ', err));
*/

const getDogPic = async () => {
	try {
		const data = await readFilePro(`${__dirname}/dog.txt`);
		console.log(`Bread: ${data}`);

		const all = await Promise.all([
			superagent.get(`https://dog.ceo/api/breed/${data}/images/random`),
			superagent.get(`https://dog.ceo/api/breed/${data}/images/random`),
			superagent.get(`https://dog.ceo/api/breed/${data}/images/random`),
		]);
		const images = all.map(img => img.body.message);
		console.log(images);

		console.log('GOT the photo');
		//   console.log(res.body.message);

		await writeFilePro('dog-img.txt', images.join('\n'));
		console.log('Radom dog images saved to file');
	} catch (err) {
		console.error('🔴 Erorr: ', err);
		throw err;
	}
	return '2: Ready 🐶';
};

(async () => {
	try {
		console.log('1: will ge t dog pics');
		const x = await getDogPic();
		console.log(x);
		console.log('3: Done');
	} catch (err) {
		console.log(err);
	}
})();

/*
getDogPic()
	.then(x => {
		console.log(x);

		console.log('3: Done');
	})
	.catch(error => console.log(error));

*/

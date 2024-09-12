const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
// 1) Middelware
app.use(morgan('dev'));

app.use(express.json());
app.use((req, res, next) => {
	console.log('Hello from middleware 👋');
	next();
});

app.use((req, res, next) => {
	req.requestTime = new Date().toISOString();
	next();
});
// reading data
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);
// 2) functions ...
// Tour Recours
function getAllTours(req, res) {
	console.log(req.requestTime);

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: tours.length,
		data: { tours },
	});
}

function getTour(req, res) {
	const tour = tours.find(el => el.id === +req.params.id);
	if (!tour)
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});

	res.status(200).json({
		status: 'success',
		data: {
			tour,
		},
	});
}

function createTour(req, res) {
	const newID = tours[tours.length - 1].id + 1;
	const newtour = Object.assign({ id: newID }, req.body);
	tours.push(newtour);
	fs.writeFile(
		`${__dirname}/dev-data/data/tours-simple.json`,
		JSON.stringify(tours),
		err => {
			res.status(201).json({
				status: 'success',
				data: { tour: newtour },
			});
		},
	);
}

function updateTour(req, res) {
	if (+req.params.id > tours.length)
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});

	res.status(200).json({
		status: 'success',
		data: {
			tour: '<Updated TOUR hear>',
		},
	});
}

function deleteTour(req, res) {
	if (+req.params.id > tours.length)
		return res.status(404).json({
			status: 'fail',
			message: 'Invalid ID',
		});

	res.status(204).json({
		status: 'succees',
		data: {
			tour: null,
		},
	});
}
// Users Rescours
function getAllUsers(req, res) {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defind!',
	});
}

function createUser(req, res) {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defind!',
	});
}

function getUser(req, res) {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defind!',
	});
}

function updateUser(req, res) {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defind!',
	});
}

function deleteUser(req, res) {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defind!',
	});
}
// 3) routing ...
const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

tourRouter.route('/').get(getAllTours).post(createTour);

tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

const port = 3000;
app.listen(port, () => {
	console.log('app running on prot:', port);
});

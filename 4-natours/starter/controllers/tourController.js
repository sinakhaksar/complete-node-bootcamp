const fs = require('fs');
// reading data

const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.getAllTours = (req, res) => {
	console.log(req.requestTime);

	res.status(200).json({
		status: 'success',
		requestedAt: req.requestTime,
		results: tours.length,
		data: { tours },
	});
};

exports.getTour = (req, res) => {
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
};

exports.createTour = (req, res) => {
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
};

exports.updateTour = (req, res) => {
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
};

exports.deleteTour = (req, res) => {
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
};

const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middelwares
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

// 2) routing ...
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// it's to run server... (in server.js)
module.exports = app;

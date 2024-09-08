// console.log(arguments);
// console.log(require('module').wrapper);
// module.exports
const C = require('./test-module1');
const calc1 = new C();
console.log(calc1.add(2, 3));

// exsports

// const calc2 = require('./test-module2');
const { add, divide } = require('./test-module2');

console.log(add(2, 3));
console.log(divide(12, 2));

// // caching
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();

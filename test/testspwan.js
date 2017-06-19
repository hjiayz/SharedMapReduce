"use strict";

require("babel-polyfill");

var _index = require("../index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fun3 = function f(p) {
  if (p < 2) return 1;
  return f(p - 1) + f(p - 2);
};

let fun3S = function fibo(p) {
  if (p < 2) return 1;
  return add([fibo(p - 1), fibo(p - 2)]);
};
let fun4S = function add(args) {
  return args[0] + args[1];
};
console.time("single");
let fibo = fun3(6);
console.timeEnd("single");
console.log(fibo);
console.time("spwan");
let sp = _index2.default.spwan(fun3S, fun4S);
sp.run("fibo", 6, function (done) {
  console.timeEnd("spwan");
  sp.terminate();
  console.log(done);
}, function (err) {
  console.log(err);
});
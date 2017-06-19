"use strict";

require("babel-polyfill");

var _index = require("../index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let assert = function (info, i, j) {
  if (i == j) console.log(info, "ok.");else console.warn(info, "error!");
};
let a = new Array(1000).fill(2);
let fun = function (v, i) {
  for (var i = 1; i < 1000001; i++) {
    v = v + i;
  }
  return v;
};
let fun2 = (r, v, i) => r + v;
console.time("single");
let b = a.map(fun).reduce(fun2, 0);
console.timeEnd("single");
//console.log(b.length);
//console.log(b);

console.time("mapReduce");
_index2.default.mapReduce(a, fun, fun2, 0).then(function (done) {
  console.timeEnd("mapReduce");
  //console.log(done.length);
  //console.log(done);
  assert("mapReduce", 500000500002000, done);
  console.time("map");
  _index2.default.map(a, fun).then(function (done) {
    console.timeEnd("map");
    //console.log(done.length);
    assert("map length", 1000, done.length);
    assert("map", 500000500002, done[0]);
  });
}).catch(function (err) {
  console.log(err);
});
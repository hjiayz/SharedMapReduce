"use strict";

var _index = require("../index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let mergesort = function mergesort(a) {
  a = new Int32Array(a);
  let r = a.length;
  if (r < 2) {
    return a;
  }
  let q = r / 2;
  let la = new Int32Array(a.subarray(0, q));
  let ra = new Int32Array(a.subarray(q, r));
  return merge([mergesort(la.buffer), mergesort(ra.buffer)]);
}; //import "babel-polyfill";

let merge = function merge(arg) {
  let a = new Int32Array(arg[0]);
  let b = new Int32Array(arg[1]);
  let al = a.length;
  let bl = b.length;
  let cl = al + bl;
  let c = new Int32Array(cl);
  let ai = 0,
      bi = 0;
  let av = a[ai],
      bv = b[bi];
  let it = function (arr) {
    let i = 0;
    let j = 0;
    return function (p) {
      i += j;
      if (i < arr.length) {
        j = p;
        return arr[i];
      } else {
        j = 0;
        return 2147483647;
      }
    };
  };
  let ait = it(a);
  let bit = it(b);
  for (let i = 0; i < cl; i++) {
    if (ait(0) < bit(0)) {
      c[i] = ait(1);
    } else {
      c[i] = bit(1);
    }
  }
  return c.buffer;
};
let rand = function (x) {
  let r = new Int32Array(x);
  for (let i in r) {
    r[i] = Math.random() * 200;
  }
  return r;
};
let t = rand(50000);
console.time("single");
let fibo = mergesort(t);
console.timeEnd("single");
console.log(new Int32Array(fibo));
console.time("spwan");
let sp = _index2.default.spwan(mergesort, merge);
sp.run(mergesort.name, t.buffer, function (done) {
  console.timeEnd("spwan");
  sp.terminate();
  console.log(new Int32Array(done));
}, function (err) {
  console.log(err);
});
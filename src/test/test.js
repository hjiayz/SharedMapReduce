"use strict"
import P from '../index.js';

let data=new Float64Array(new ArrayBuffer(100000000));
let mapfun=(v,i)=>i;
let reducefun=(p,c)=>p+c;
console.time("single");
let b=data.map(mapfun).reduce(reducefun);
console.timeEnd("single");
console.log("single result:",b);
let S=new P(new Float64Array(new SharedArrayBuffer(100000000)));
console.time("Shared");
let compiledmap=P.mapf(mapfun);
let compiledreduce=P.reducef(reducefun);
S.mapreduce(compiledmap,compiledreduce).then(function(done){
  console.timeEnd("Shared");
  compiledmap.free();
  compiledreduce.free();
  console.log("result:",done);
}).catch(function(err){
  console.log(err);
  compiledmap.free();
  compiledreduce.free();
});

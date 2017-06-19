(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SharedMapReduce"] = factory();
	else
		root["SharedMapReduce"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var cpus = navigator.hardwareConcurrency || 8;
	//let cpus = 16;

	var Pool = function () {
	  function Pool(func, onmsg) {
	    var _this = this;

	    _classCallCheck(this, Pool);

	    this.queue = [];
	    this.counter = 1;
	    var arr = ["var cpus=", cpus, ";var f=", func.toString(), ";var onmsg=", onmsg.toString(), ";onmessage=function(e){onmsg(e,cpus,f,postMessage);}"];
	    var f = void 0,
	        freeURL = void 0;
	    f = window.URL.createObjectURL(new Blob(arr, { type: "application/javascript" }));
	    freeURL = window.URL.revokeObjectURL;
	    this.pool = new Array(cpus);

	    var _loop = function _loop(i) {
	      var w = new Worker(f);
	      var self = _this;
	      w.onmessage = function () {
	        if (self.counter === 1) {
	          self.cb();
	          if (self.queue.length > 0) {
	            var next = self.queue.shift();
	            self.sendall.apply(self, _toConsumableArray(next));
	          }
	        } else self.counter--;
	      };
	      w.onerror = function (err) {
	        self.err(err);
	      };
	      _this.pool[i] = w;
	    };

	    for (var i = 0; i < cpus; i++) {
	      _loop(i);
	    }
	    freeURL(f);
	  }

	  _createClass(Pool, [{
	    key: "sendall",
	    value: function sendall(data, transfers, cb, err) {
	      this.counter = cpus;
	      this.cb = cb;
	      this.err = err;
	      for (var i = 0; i < this.pool.length; i++) {
	        var w = this.pool[i];
	        w.postMessage(data.concat(i), transfers);
	        w.onerror = err;
	      }
	    }
	  }, {
	    key: "run",
	    value: function run(data, transfers, cb, err) {
	      if (this.counter === 1) {
	        this.sendall(data, transfers, cb, err);
	      } else {
	        this.queue.push([data, transfers, cb, err]);
	      }
	    }
	  }, {
	    key: "free",
	    value: function free() {
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        for (var _iterator = this.pool[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var w = _step.value;

	          w.terminate();
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	    }
	  }]);

	  return Pool;
	}();

	var SharedMapReduce = function () {
	  function SharedMapReduce(array) {
	    _classCallCheck(this, SharedMapReduce);

	    this.data = array;
	  }

	  _createClass(SharedMapReduce, [{
	    key: "map",
	    value: function map(compiledfunc) {
	      var self = this;
	      return new Promise(function (resolve, reject) {
	        var output = new self.data.constructor(new SharedArrayBuffer(self.data.buffer.byteLength));
	        var cb = function cb() {
	          return resolve(output);
	        };
	        compiledfunc.run([self.data, output], [], cb, reject);
	      });
	    }
	  }, {
	    key: "reduce",
	    value: function reduce(compiledfunc) {
	      var self = this;
	      return new Promise(function (resolve, reject) {
	        var output = new self.data.constructor(new SharedArrayBuffer(cpus * self.data.BYTES_PER_ELEMENT));
	        var status = new Int32Array(new SharedArrayBuffer(cpus << 1));
	        //status.fill(0);
	        var cb = function cb() {
	          return resolve(output[0]);
	        };
	        compiledfunc.run([self.data, output, status], [], cb, reject);
	      });
	    }
	  }, {
	    key: "mapreduce",
	    value: function mapreduce(compiledfuncmapfunc, compiledfuncreducefunc, init) {
	      var self = this;
	      return new Promise(function (resolve, reject) {
	        self.map(compiledfuncmapfunc).then(function (done) {
	          var data = new SharedMapReduce(done);
	          data.reduce(compiledfuncreducefunc).then(function (done) {
	            resolve(done);
	          }).catch(function (err) {
	            reject(err);
	          });
	        }).catch(function (err) {
	          reject(err);
	        });
	      });
	    }
	  }], [{
	    key: "mapf",
	    value: function mapf(f) {
	      return new Pool(f, function (e, cpus, f, pm) {
	        var d = e.data;

	        var id = d[2];
	        var input = d[0];
	        var output = d[1];
	        var l = input.length;
	        for (var i = id; i < l; i += cpus) {
	          output[i] = f(input[i], i, input);
	        }
	        pm(0);
	      });
	    }
	  }, {
	    key: "reducef",
	    value: function reducef(f) {
	      return new Pool(f, function (e, cpus, f, pm) {
	        var d = e.data;
	        var id = d[3];
	        var input = d[0];
	        var output = d[1];
	        var l = input.length;
	        var status = d[2];
	        var t = cpus;
	        var tid = id;
	        output[id] = input[id];
	        for (var i = id + t; i < l; i += t) {
	          output[id] = f(output[id], input[i]);
	        }
	        t = t >> 1;
	        for (var _i = 0; t > 0; _i++, t = t >> 1) {
	          if (id >= t) id -= t;
	          //console.log("tid:",tid,"id:",id,i,t,output,status);
	          var low = (2 << _i) - 1;
	          if ((Atomics.or(status, id, 1 << _i) & low) != low) break;
	          output[id] = f(output[id], output[id + t]);
	          //console.log("tid:",tid,"id:",id,i,t,"add:",id,id+t);
	        }
	        pm(0);
	      });
	    }
	  }]);

	  return SharedMapReduce;
	}();

	exports.default = SharedMapReduce;

/***/ }
/******/ ])
});
;
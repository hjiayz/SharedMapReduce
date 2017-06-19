/******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _index = __webpack_require__(2);

	var _index2 = _interopRequireDefault(_index);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var assert = function assert(info, i, j) {
	  return i == j ? console.log(info, " ok.") : console.log(info, " error!");
	};
	var a = new Array(1000).fill(2);
	var fun = function fun(v, i) {
	  for (var i = 1; i < 1000001; i++) {
	    v = v + i;
	  }
	  return v;
	};
	var fun2 = function fun2(r, v, i) {
	  return r + v;
	};
	console.time("single");
	var b = a.map(fun).reduce(fun2, 0);
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
	    //console.log(done);
	  });
	}).catch(function (err) {
	  console.log(err);
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {"use strict";

	function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

	!(function (e, n) {
	  "object" == ( false ? "undefined" : _typeof(exports)) && "object" == ( false ? "undefined" : _typeof(module)) ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (n), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.spwan = n() : e.spwan = n();
	})(undefined, function () {
	  return (function (e) {
	    function n(r) {
	      if (t[r]) return t[r].exports;var o = t[r] = { exports: {}, id: r, loaded: !1 };return e[r].call(o.exports, o, o.exports, n), o.loaded = !0, o.exports;
	    }var t = {};return n.m = e, n.c = t, n.p = "", n(0);
	  })([function (e, n, t) {
	    e.exports = t(1);
	  }, function (e, n, t) {
	    "use strict";
	    function r(e, n) {
	      if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
	    }var o = (function () {
	      function e(e, n) {
	        for (var t = 0; t < n.length; t++) {
	          var r = n[t];r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
	        }
	      }return function (n, t, r) {
	        return t && e(n.prototype, t), r && e(n, r), n;
	      };
	    })();Object.defineProperty(n, "__esModule", { value: !0 });var a = (function () {
	      function e() {
	        r(this, e);
	      }return o(e, null, [{ key: "mapReduce", value: function value(n, t, r, o, a) {
	          return new Promise(function (u, i) {
	            var c = n.length,
	                f = c,
	                s = void 0,
	                p = void 0,
	                l = !0;"function" == typeof t ? (a > c && (a = c), s = e.newPool(a, t)) : (l = !1, s = t);var d = function v(e) {
	              var t = function t() {
	                f > 0 ? v(e) : 0 >= c && (l && s.forEach(function (e) {
	                  return e.terminate();
	                }), p && i({ err: p, res: o }), u(o));
	              };e.onmessage = function (e) {
	                var a = e.data;o = r(o, a[1], a[0], n), c--, t();
	              }, e.onerror = function (e) {
	                c--, p || (p = []), p.push(e), t();
	              }, f--, e.postMessage([f, n[f]]);
	            };s.forEach(function (e) {
	              return d(e);
	            });
	          });
	        } }, { key: "map", value: function value(e, n, t) {
	          return this.mapReduce(e, n, function (e, n, t) {
	            return e[t] = n, e;
	          }, new Array(this.length), t);
	        } }, { key: "newPool", value: function value(e, n) {
	          var r = t(2);return r(e, n);
	        } }]), e;
	    })();n["default"] = a;
	  }, function (e, n) {
	    "use strict";
	    e.exports = function (e, n) {
	      var t = ['"use strict"\nlet mapfn = ', n.toString(), ";onmessage=(e)=>postMessage([e.data[0],mapfn(e.data[1],e.data[0])])"],
	          r = void 0,
	          o = void 0,
	          a = void 0;r = navigator.hardwareConcurrency, o = window.URL.createObjectURL(new Blob(t, { type: "application/javascript" })), a = function () {
	        return window.URL.revokeObjectURL(o);
	      }, e = e || r;for (var u = new Array(e), i = 0; e > i; i++) {
	        u[i] = new Worker(o);
	      }return a(), u;
	    };
	  }]);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module)))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ]);
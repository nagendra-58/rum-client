/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TrackPerformance = /** @class */ (function () {
    function TrackPerformance(_a) {
        var _this = this;
        var trackUrl = _a.trackUrl, _b = _a.threshold, threshold = _b === void 0 ? 6000 : _b, _c = _a.batchSize, batchSize = _c === void 0 ? 50 : _c, _d = _a.excludeKeys, excludeKeys = _d === void 0 ? [] : _d, _e = _a.excludeHosts, excludeHosts = _e === void 0 ? [] : _e, _f = _a.includeHosts, includeHosts = _f === void 0 ? [] : _f, parserCb = _a.parserCb, filterCb = _a.filterCb, addAdditionalData = _a.addAdditionalData;
        this.queuedEntries = [];
        this.options = {
            trackUrl: trackUrl,
            threshold: threshold,
            batchSize: batchSize,
            excludeKeys: excludeKeys,
            excludeHosts: excludeHosts,
            includeHosts: includeHosts,
            parserCb: parserCb,
            filterCb: filterCb,
            addAdditionalData: addAdditionalData,
        };
        if ("performance" in window) {
            if ("PerformanceObserver" in window) {
                var perfObserver = new PerformanceObserver(function (list, obj) {
                    _this.handleEntries(list.getEntries());
                });
                perfObserver.observe({
                    entryTypes: ["resource"],
                });
            }
            else {
                // To-Do
            }
        }
        // tslint:disable-next-line
        window.onload = function () {
            setTimeout(function () {
                _this.handleEntries(performance.getEntriesByType("navigation"));
            }, 0);
        };
        console.log("Setting up setInterval to push track data");
        this.intervalId = window.setInterval(function () {
            if (_this.queuedEntries.length) {
                _this.sendToServer();
                _this.queuedEntries = [];
            }
        }, threshold);
    }
    TrackPerformance.computeMetrics = function (entry, type, dom) {
        entry.dnsLookUp = entry.domainLookupEnd - entry.domainLookupStart;
        // Total Connection time
        entry.connectionTime = entry.connectEnd - entry.connectStart;
        // TLS time
        if (entry.secureConnectionStart > 0) {
            entry.tlsTime = entry.connectEnd - entry.secureConnectionStart;
        }
        // Time to First Byte (TTFB)
        entry.ttfb = entry.responseStart - entry.requestStart;
        /*
          The fetchStart read-only property represents a timestamp immediately
          before the browser starts to fetch the resource.
        */
        entry.fetchTime = entry.responseEnd - entry.fetchStart;
        if (entry.workerStart > 0) {
            entry.workerTime = entry.responseEnd - entry.workerStart;
        }
        /*
          The requestStart read-only property returns a timestamp of the time
          immediately before the browser starts requesting the resource from the
          server, cache, or local resource
          Request plus response time (network only)
        */
        entry.totalTime = entry.responseEnd - entry.requestStart;
        // Response time only (download)
        entry.downloadTime = entry.responseEnd - entry.responseStart;
        // HTTP header size
        entry.headerSize = entry.transferSize - entry.encodedBodySize;
        // Compression ratio
        entry.compressionRatio = entry.decodedBodySize / entry.encodedBodySize;
        console.log("DOMContentLoadTime-------->", entry.domContentLoadedEventEnd);
        console.log("pageLoadTime-------->", entry.loadEventEnd);
        // Page Time
        if (entry.entryType === "navigation") {
            entry.domContentLoaded = entry.domContentLoadedEventEnd - entry.startTime;
            entry.pageLoad = entry.loadEventEnd - entry.startTime;
        }
        dom = performance.getEntriesByType("navigation")[0];
        type = navigator;
        console.log("navigator-------->", type);
        entry.useragent = navigator.userAgent;
        entry.os = TrackPerformance.getOS();
        entry.browser = "" + window.navigator.appName + window.navigator.appVersion;
        entry.devicetype = TrackPerformance.getDeviceType();
        entry.pageURL = window.location.href;
        entry.urlPath = window.location.pathname;
        entry.domain = window.location.hostname;
        entry.pageTitle = document.title;
        entry.backend = entry.ttfb;
        entry.startRender = entry.startTime;
        entry.sslNegotiation = entry.tlsTime;
        entry.redirect = entry.redirectStart;
        entry.connectiontype = type.connection.effectiveType;
        entry.domInteractive = dom.domInteractive;
        return entry;
    };
    TrackPerformance.chunk = function (array, size) {
        return array.reduce(function (res, item, index) {
            if (index % size === 0) {
                res.push([]);
            }
            res[res.length - 1].push(item);
            return res;
        }, []);
    };
    TrackPerformance.prototype.handleEntries = function (entries) {
        var _a = this.options, trackUrl = _a.trackUrl, excludeKeys = _a.excludeKeys, excludeHosts = _a.excludeHosts, includeHosts = _a.includeHosts, parserCb = _a.parserCb, filterCb = _a.filterCb;
        entries = entries.map(function (entry) { return entry.toJSON(); });
        // entries = entries.filter((entry) => {
        //   let flag = entry.name.indexOf(trackUrl) === -1;
        //   console.log(" entries.name------------>",entry.name);
        //   flag = includeHosts.length > 0 ?
        //     (flag && includeHosts.some((host) => entry.name.indexOf(host) > -1)) :
        //     (flag && !excludeHosts.some((host) => entry.name.indexOf(host) > -1));
        //   return flag;
        // });
        entries = entries.map(TrackPerformance.computeMetrics);
        if (parserCb && typeof parserCb === "function") {
            entries = entries.map(parserCb);
        }
        if (filterCb && typeof filterCb === "function") {
            entries = entries.filter(filterCb);
        }
        if (excludeKeys.length) {
            entries = entries.map(function (entry) {
                return Object.keys(entry).reduce(function (acc, key) {
                    if (excludeKeys.indexOf(key) === -1) {
                        acc[key] = entry[key];
                    }
                    return acc;
                }, {});
            });
        }
        this.queuedEntries = this.queuedEntries.concat(entries);
        console.log("queuedEntries---------->", this.queuedEntries);
    };
    TrackPerformance.prototype.sendToServer = function () {
        var _a = this.options, _b = _a.batchSize, batchSize = _b === void 0 ? 50 : _b, trackUrl = _a.trackUrl, addAdditionalData = _a.addAdditionalData;
        var entryChunks = TrackPerformance.chunk(this.queuedEntries, batchSize);
        var promise = Promise.resolve();
        entryChunks.forEach(function (entryChunk, index) {
            promise = promise.then(function () {
                return new Promise(function (resolve, reject) {
                    var body = {
                        data: entryChunk,
                        additionalData: addAdditionalData(),
                    };
                    fetch(trackUrl, {
                        method: "post",
                        headers: {
                            Accept: "application/json, text/plain, */*",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body),
                    })
                        .then(function (res) { return res.json(); })
                        .then(function (res) {
                        return resolve();
                    })
                        .catch(function (error) {
                        // tslint:disable-next-line
                        console.log("Error while sending data to /track: ", error, body);
                        return resolve();
                    });
                });
            });
        });
    };
    TrackPerformance.prototype.stop = function () {
        clearInterval(this.intervalId);
        this.intervalId = 0;
    };
    // Get device type
    TrackPerformance.getDeviceType = function () {
        var ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return "tablet";
        }
        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return "mobile";
        }
        return "desktop";
    };
    // Get OS
    TrackPerformance.getOS = function () {
        var userAgent = window.navigator.userAgent, platform = window.navigator.platform, macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"], windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"], iosPlatforms = ["iPhone", "iPad", "iPod"], os = null;
        if (macosPlatforms.indexOf(platform) !== -1) {
            os = "Mac OS";
        }
        else if (iosPlatforms.indexOf(platform) !== -1) {
            os = "iOS";
        }
        else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = "Windows";
        }
        else if (/Android/.test(userAgent)) {
            os = "Android";
        }
        else if (!os && /Linux/.test(platform)) {
            os = "Linux";
        }
        return os;
    };
    return TrackPerformance;
}());
// export a global variable to access later
window.TrackPerformance = TrackPerformance;
exports.default = TrackPerformance;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ3RFQTtJQW9GRSwwQkFBWSxFQVVlO1FBVjNCLGlCQW9EQztZQW5EQyxzQkFBUSxFQUNSLGlCQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsaUJBQWMsRUFBZCxtQ0FBYyxFQUNkLG1CQUFnQixFQUFoQixxQ0FBZ0IsRUFDaEIsb0JBQWlCLEVBQWpCLHNDQUFpQixFQUNqQixvQkFBaUIsRUFBakIsc0NBQWlCLEVBQ2pCLHNCQUFRLEVBQ1Isc0JBQVEsRUFDUix3Q0FBaUI7UUFFakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNiLFFBQVE7WUFDUixTQUFTO1lBQ1QsU0FBUztZ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aEI7YUFBTSxJQUFJLENBQUMsRUFBRSxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDeEMsRUFBRSxHQUFHLE9BQU8sQ0FBQztTQUNkO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDO0FBRUQsMkNBQTJDO0FBQzFDLE1BQWMsQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUNwRCxrQkFBZSxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJydW0tY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJleHBvcnQgaW50ZXJmYWNlIElUcmFja1BlcmZvcm1hbmNlT3B0aW9ucyB7XHJcbiAgdHJhY2tVcmw6IHN0cmluZztcclxuICB0aHJlc2hvbGQ/OiBudW1iZXI7XHJcbiAgYmF0Y2hTaXplPzogbnVtYmVyO1xyXG4gIGV4Y2x1ZGVLZXlzOiBzdHJpbmdbXTtcclxuICBleGNsdWRlSG9zdHM6IHN0cmluZ1tdO1xyXG4gIGluY2x1ZGVIb3N0czogc3RyaW5nW107XHJcbiAgcGFyc2VyQ2I6IGFueTtcclxuICBmaWx0ZXJDYjogYW55O1xyXG4gIGFkZEFkZGl0aW9uYWxEYXRhOiBhbnk7XHJcbn1cclxuXHJcbmNsYXNzIFRyYWNrUGVyZm9ybWFuY2Uge1xyXG4gIHN0YXRpYyBjb21wdXRlTWV0cmljcyhlbnRyeTogYW55LCB0eXBlOiBhbnksIGRvbTogYW55KSB7XHJcbiAgICBlbnRyeS5kbnNMb29rVXAgPSBlbnRyeS5kb21haW5Mb29rdXBFbmQgLSBlbnRyeS5kb21haW5Mb29rdXBTdGFydDtcclxuXHJcbiAgICAvLyBUb3RhbCBDb25uZWN0aW9uIHRpbWVcclxuICAgIGVudHJ5LmNvbm5lY3Rpb25UaW1lID0gZW50cnkuY29ubmVjdEVuZCAtIGVudHJ5LmNvbm5lY3RTdGFydDtcclxuXHJcbiAgICAvLyBUTFMgdGltZVxyXG4gICAgaWYgKGVudHJ5LnNlY3VyZUNvbm5lY3Rpb25TdGFydCA+IDApIHtcclxuICAgICAgZW50cnkudGxzVGltZSA9IGVudHJ5LmNvbm5lY3RFbmQgLSBlbnRyeS5zZWN1cmVDb25uZWN0aW9uU3RhcnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGltZSB0byBGaXJzdCBCeXRlIChUVEZCKVxyXG4gICAgZW50cnkudHRmYiA9IGVudHJ5LnJlc3BvbnNlU3RhcnQgLSBlbnRyeS5yZXF1ZXN0U3RhcnQ7XHJcblxyXG4gICAgLypcclxuICAgICAgVGhlIGZldGNoU3RhcnQgcmVhZC1vbmx5IHByb3BlcnR5IHJlcHJlc2VudHMgYSB0aW1lc3RhbXAgaW1tZWRpYXRlbHlcclxuICAgICAgYmVmb3JlIHRoZSBicm93c2VyIHN0YXJ0cyB0byBmZXRjaCB0aGUgcmVzb3VyY2UuXHJcbiAgICAqL1xyXG4gICAgZW50cnkuZmV0Y2hUaW1lID0gZW50cnkucmVzcG9uc2VFbmQgLSBlbnRyeS5mZXRjaFN0YXJ0O1xyXG4gICAgaWYgKGVudHJ5LndvcmtlclN0YXJ0ID4gMCkge1xyXG4gICAgICBlbnRyeS53b3JrZXJUaW1lID0gZW50cnkucmVzcG9uc2VFbmQgLSBlbnRyeS53b3JrZXJTdGFydDtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICBUaGUgcmVxdWVzdFN0YXJ0IHJlYWQtb25seSBwcm9wZXJ0eSByZXR1cm5zIGEgdGltZXN0YW1wIG9mIHRoZSB0aW1lXHJcbiAgICAgIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgYnJvd3NlciBzdGFydHMgcmVxdWVzdGluZyB0aGUgcmVzb3VyY2UgZnJvbSB0aGVcclxuICAgICAgc2VydmVyLCBjYWNoZSwgb3IgbG9jYWwgcmVzb3VyY2VcclxuICAgICAgUmVxdWVzdCBwbHVzIHJlc3BvbnNlIHRpbWUgKG5ldHdvcmsgb25seSlcclxuICAgICovXHJcbiAgICBlbnRyeS50b3RhbFRpbWUgPSBlbnRyeS5yZXNwb25zZUVuZCAtIGVudHJ5LnJlcXVlc3RTdGFydDtcclxuXHJcbiAgICAvLyBSZXNwb25zZSB0aW1lIG9ubHkgKGRvd25sb2FkKVxyXG4gICAgZW50cnkuZG93bmxvYWRUaW1lID0gZW50cnkucmVzcG9uc2VFbmQgLSBlbnRyeS5yZXNwb25zZVN0YXJ0O1xyXG5cclxuICAgIC8vIEhUVFAgaGVhZGVyIHNpemVcclxuICAgIGVudHJ5LmhlYWRlclNpemUgPSBlbnRyeS50cmFuc2ZlclNpemUgLSBlbnRyeS5lbmNvZGVkQm9keVNpemU7XHJcblxyXG4gICAgLy8gQ29tcHJlc3Npb24gcmF0aW9cclxuICAgIGVudHJ5LmNvbXByZXNzaW9uUmF0aW8gPSBlbnRyeS5kZWNvZGVkQm9keVNpemUgLyBlbnRyeS5lbmNvZGVkQm9keVNpemU7XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJET01Db250ZW50TG9hZFRpbWUtLS0tLS0tLT5cIiwgZW50cnkuZG9tQ29udGVudExvYWRlZEV2ZW50RW5kKTtcclxuICAgIGNvbnNvbGUubG9nKFwicGFnZUxvYWRUaW1lLS0tLS0tLS0+XCIsIGVudHJ5LmxvYWRFdmVudEVuZCk7XHJcblxyXG4gICAgLy8gUGFnZSBUaW1lXHJcbiAgICBpZiAoZW50cnkuZW50cnlUeXBlID09PSBcIm5hdmlnYXRpb25cIikge1xyXG4gICAgICBlbnRyeS5kb21Db250ZW50TG9hZGVkID0gZW50cnkuZG9tQ29udGVudExvYWRlZEV2ZW50RW5kIC0gZW50cnkuc3RhcnRUaW1lO1xyXG4gICAgICBlbnRyeS5wYWdlTG9hZCA9IGVudHJ5LmxvYWRFdmVudEVuZCAtIGVudHJ5LnN0YXJ0VGltZTtcclxuICAgIH1cclxuICAgIGRvbSA9IHBlcmZvcm1hbmNlLmdldEVudHJpZXNCeVR5cGUoXCJuYXZpZ2F0aW9uXCIpWzBdO1xyXG4gICAgdHlwZSA9IG5hdmlnYXRvcjtcclxuICAgIGNvbnNvbGUubG9nKFwibmF2aWdhdG9yLS0tLS0tLS0+XCIsIHR5cGUpO1xyXG5cclxuICAgIGVudHJ5LnVzZXJhZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XHJcbiAgICBlbnRyeS5vcyA9IFRyYWNrUGVyZm9ybWFuY2UuZ2V0T1MoKTtcclxuICAgIGVudHJ5LmJyb3dzZXIgPSBgJHt3aW5kb3cubmF2aWdhdG9yLmFwcE5hbWV9JHt3aW5kb3cubmF2aWdhdG9yLmFwcFZlcnNpb259YDtcclxuICAgIGVudHJ5LmRldmljZXR5cGUgPSBUcmFja1BlcmZvcm1hbmNlLmdldERldmljZVR5cGUoKTtcclxuICAgIGVudHJ5LnBhZ2VVUkwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcclxuICAgIGVudHJ5LnVybFBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICBlbnRyeS5kb21haW4gPSB3aW5kb3cubG9jYXRpb24uaG9zdG5hbWU7XHJcbiAgICBlbnRyeS5wYWdlVGl0bGUgPSBkb2N1bWVudC50aXRsZTtcclxuICAgIGVudHJ5LmJhY2tlbmQgPSBlbnRyeS50dGZiO1xyXG4gICAgZW50cnkuc3RhcnRSZW5kZXIgPSBlbnRyeS5zdGFydFRpbWU7XHJcbiAgICBlbnRyeS5zc2xOZWdvdGlhdGlvbiA9IGVudHJ5LnRsc1RpbWU7XHJcbiAgICBlbnRyeS5yZWRpcmVjdCA9IGVudHJ5LnJlZGlyZWN0U3RhcnQ7XHJcbiAgICBlbnRyeS5jb25uZWN0aW9udHlwZSA9IHR5cGUuY29ubmVjdGlvbi5lZmZlY3RpdmVUeXBlO1xyXG4gICAgZW50cnkuZG9tSW50ZXJhY3RpdmUgPSBkb20uZG9tSW50ZXJhY3RpdmU7XHJcblxyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNodW5rKGFycmF5OiBhbnlbXSwgc2l6ZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYXJyYXkucmVkdWNlKChyZXMsIGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIGlmIChpbmRleCAlIHNpemUgPT09IDApIHtcclxuICAgICAgICByZXMucHVzaChbXSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVzW3Jlcy5sZW5ndGggLSAxXS5wdXNoKGl0ZW0pO1xyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfSwgW10pO1xyXG4gIH1cclxuICBxdWV1ZWRFbnRyaWVzOiBhbnlbXTtcclxuICBvcHRpb25zOiBJVHJhY2tQZXJmb3JtYW5jZU9wdGlvbnM7XHJcbiAgaW50ZXJ2YWxJZDogbnVtYmVyO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih7XHJcbiAgICB0cmFja1VybCxcclxuICAgIHRocmVzaG9sZCA9IDYwMDAsXHJcbiAgICBiYXRjaFNpemUgPSA1MCxcclxuICAgIGV4Y2x1ZGVLZXlzID0gW10sXHJcbiAgICBleGNsdWRlSG9zdHMgPSBbXSxcclxuICAgIGluY2x1ZGVIb3N0cyA9IFtdLFxyXG4gICAgcGFyc2VyQ2IsXHJcbiAgICBmaWx0ZXJDYixcclxuICAgIGFkZEFkZGl0aW9uYWxEYXRhLFxyXG4gIH06IElUcmFja1BlcmZvcm1hbmNlT3B0aW9ucykge1xyXG4gICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gW107XHJcbiAgICB0aGlzLm9wdGlvbnMgPSB7XHJcbiAgICAgIHRyYWNrVXJsLFxyXG4gICAgICB0aHJlc2hvbGQsXHJcbiAgICAgIGJhdGNoU2l6ZSxcclxuICAgICAgZXhjbHVkZUtleXMsXHJcbiAgICAgIGV4Y2x1ZGVIb3N0cyxcclxuICAgICAgaW5jbHVkZUhvc3RzLFxyXG4gICAgICBwYXJzZXJDYixcclxuICAgICAgZmlsdGVyQ2IsXHJcbiAgICAgIGFkZEFkZGl0aW9uYWxEYXRhLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoXCJwZXJmb3JtYW5jZVwiIGluIHdpbmRvdykge1xyXG4gICAgICBpZiAoXCJQZXJmb3JtYW5jZU9ic2VydmVyXCIgaW4gd2luZG93KSB7XHJcbiAgICAgICAgY29uc3QgcGVyZk9ic2VydmVyID0gbmV3IFBlcmZvcm1hbmNlT2JzZXJ2ZXIoKGxpc3QsIG9iaikgPT4ge1xyXG4gICAgICAgICAgdGhpcy5oYW5kbGVFbnRyaWVzKGxpc3QuZ2V0RW50cmllcygpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGVyZk9ic2VydmVyLm9ic2VydmUoe1xyXG4gICAgICAgICAgZW50cnlUeXBlczogW1wicmVzb3VyY2VcIl0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gVG8tRG9cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxyXG5cclxuICAgIHdpbmRvdy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRW50cmllcyhwZXJmb3JtYW5jZS5nZXRFbnRyaWVzQnlUeXBlKFwibmF2aWdhdGlvblwiKSk7XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfTtcclxuICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyB1cCBzZXRJbnRlcnZhbCB0byBwdXNoIHRyYWNrIGRhdGFcIik7XHJcbiAgICB0aGlzLmludGVydmFsSWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5xdWV1ZWRFbnRyaWVzLmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuc2VuZFRvU2VydmVyKCk7XHJcbiAgICAgICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gW107XHJcbiAgICAgIH1cclxuICAgIH0sIHRocmVzaG9sZCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFbnRyaWVzKGVudHJpZXM6IGFueVtdKSB7XHJcbiAgICBjb25zdCB7XHJcbiAgICAgIHRyYWNrVXJsLFxyXG4gICAgICBleGNsdWRlS2V5cyxcclxuICAgICAgZXhjbHVkZUhvc3RzLFxyXG4gICAgICBpbmNsdWRlSG9zdHMsXHJcbiAgICAgIHBhcnNlckNiLFxyXG4gICAgICBmaWx0ZXJDYixcclxuICAgIH0gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBlbnRyaWVzID0gZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS50b0pTT04oKSk7XHJcblxyXG4gICAgLy8gZW50cmllcyA9IGVudHJpZXMuZmlsdGVyKChlbnRyeSkgPT4ge1xyXG4gICAgLy8gICBsZXQgZmxhZyA9IGVudHJ5Lm5hbWUuaW5kZXhPZih0cmFja1VybCkgPT09IC0xO1xyXG4gICAgLy8gICBjb25zb2xlLmxvZyhcIiBlbnRyaWVzLm5hbWUtLS0tLS0tLS0tLS0+XCIsZW50cnkubmFtZSk7XHJcbiAgICAvLyAgIGZsYWcgPSBpbmNsdWRlSG9zdHMubGVuZ3RoID4gMCA/XHJcbiAgICAvLyAgICAgKGZsYWcgJiYgaW5jbHVkZUhvc3RzLnNvbWUoKGhvc3QpID0+IGVudHJ5Lm5hbWUuaW5kZXhPZihob3N0KSA+IC0xKSkgOlxyXG4gICAgLy8gICAgIChmbGFnICYmICFleGNsdWRlSG9zdHMuc29tZSgoaG9zdCkgPT4gZW50cnkubmFtZS5pbmRleE9mKGhvc3QpID4gLTEpKTtcclxuICAgIC8vICAgcmV0dXJuIGZsYWc7XHJcbiAgICAvLyB9KTtcclxuXHJcbiAgICBlbnRyaWVzID0gZW50cmllcy5tYXAoVHJhY2tQZXJmb3JtYW5jZS5jb21wdXRlTWV0cmljcyk7XHJcblxyXG4gICAgaWYgKHBhcnNlckNiICYmIHR5cGVvZiBwYXJzZXJDYiA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgIGVudHJpZXMgPSBlbnRyaWVzLm1hcChwYXJzZXJDYik7XHJcbiAgICB9XHJcbiAgICBpZiAoZmlsdGVyQ2IgJiYgdHlwZW9mIGZpbHRlckNiID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgZW50cmllcyA9IGVudHJpZXMuZmlsdGVyKGZpbHRlckNiKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXhjbHVkZUtleXMubGVuZ3RoKSB7XHJcbiAgICAgIGVudHJpZXMgPSBlbnRyaWVzLm1hcCgoZW50cnkpID0+IHtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZW50cnkpLnJlZHVjZSgoYWNjOiBhbnksIGtleSkgPT4ge1xyXG4gICAgICAgICAgaWYgKGV4Y2x1ZGVLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgYWNjW2tleV0gPSBlbnRyeVtrZXldO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGFjYztcclxuICAgICAgICB9LCB7fSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgdGhpcy5xdWV1ZWRFbnRyaWVzID0gdGhpcy5xdWV1ZWRFbnRyaWVzLmNvbmNhdChlbnRyaWVzKTtcclxuICAgIGNvbnNvbGUubG9nKFwicXVldWVkRW50cmllcy0tLS0tLS0tLS0+XCIsIHRoaXMucXVldWVkRW50cmllcyk7XHJcbiAgfVxyXG5cclxuICBzZW5kVG9TZXJ2ZXIoKSB7XHJcbiAgICBjb25zdCB7IGJhdGNoU2l6ZSA9IDUwLCB0cmFja1VybCwgYWRkQWRkaXRpb25hbERhdGEgfSA9IHRoaXMub3B0aW9ucztcclxuICAgIGNvbnN0IGVudHJ5Q2h1bmtzID0gVHJhY2tQZXJmb3JtYW5jZS5jaHVuayh0aGlzLnF1ZXVlZEVudHJpZXMsIGJhdGNoU2l6ZSk7XHJcbiAgICBsZXQgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgZW50cnlDaHVua3MuZm9yRWFjaCgoZW50cnlDaHVuazogYW55W10sIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgcHJvbWlzZSA9IHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgICAgIGRhdGE6IGVudHJ5Q2h1bmssXHJcbiAgICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBhZGRBZGRpdGlvbmFsRGF0YSgpLFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBmZXRjaCh0cmFja1VybCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgQWNjZXB0OiBcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwiLFxyXG4gICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5KSxcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKChyZXMpID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBzZW5kaW5nIGRhdGEgdG8gL3RyYWNrOiBcIiwgZXJyb3IsIGJvZHkpO1xyXG4gICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RvcCgpIHtcclxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbElkKTtcclxuICAgIHRoaXMuaW50ZXJ2YWxJZCA9IDA7XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgZGV2aWNlIHR5cGVcclxuICBzdGF0aWMgZ2V0RGV2aWNlVHlwZSgpOiBhbnkge1xyXG4gICAgY29uc3QgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xyXG4gICAgaWYgKC8odGFibGV0fGlwYWR8cGxheWJvb2t8c2lsayl8KGFuZHJvaWQoPyEuKm1vYmkpKS9pLnRlc3QodWEpKSB7XHJcbiAgICAgIHJldHVybiBcInRhYmxldFwiO1xyXG4gICAgfVxyXG4gICAgaWYgKFxyXG4gICAgICAvTW9iaWxlfGlQKGhvbmV8b2QpfEFuZHJvaWR8QmxhY2tCZXJyeXxJRU1vYmlsZXxLaW5kbGV8U2lsay1BY2NlbGVyYXRlZHwoaHB3fHdlYilPU3xPcGVyYSBNKG9iaXxpbmkpLy50ZXN0KFxyXG4gICAgICAgIHVhXHJcbiAgICAgIClcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gXCJtb2JpbGVcIjtcclxuICAgIH1cclxuICAgIHJldHVybiBcImRlc2t0b3BcIjtcclxuICB9XHJcblxyXG4gIC8vIEdldCBPU1xyXG4gIHN0YXRpYyBnZXRPUygpOiBhbnkge1xyXG4gICAgdmFyIHVzZXJBZ2VudCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LFxyXG4gICAgICBwbGF0Zm9ybSA9IHdpbmRvdy5uYXZpZ2F0b3IucGxhdGZvcm0sXHJcbiAgICAgIG1hY29zUGxhdGZvcm1zID0gW1wiTWFjaW50b3NoXCIsIFwiTWFjSW50ZWxcIiwgXCJNYWNQUENcIiwgXCJNYWM2OEtcIl0sXHJcbiAgICAgIHdpbmRvd3NQbGF0Zm9ybXMgPSBbXCJXaW4zMlwiLCBcIldpbjY0XCIsIFwiV2luZG93c1wiLCBcIldpbkNFXCJdLFxyXG4gICAgICBpb3NQbGF0Zm9ybXMgPSBbXCJpUGhvbmVcIiwgXCJpUGFkXCIsIFwiaVBvZFwiXSxcclxuICAgICAgb3MgPSBudWxsO1xyXG5cclxuICAgIGlmIChtYWNvc1BsYXRmb3Jtcy5pbmRleE9mKHBsYXRmb3JtKSAhPT0gLTEpIHtcclxuICAgICAgb3MgPSBcIk1hYyBPU1wiO1xyXG4gICAgfSBlbHNlIGlmIChpb3NQbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgIT09IC0xKSB7XHJcbiAgICAgIG9zID0gXCJpT1NcIjtcclxuICAgIH0gZWxzZSBpZiAod2luZG93c1BsYXRmb3Jtcy5pbmRleE9mKHBsYXRmb3JtKSAhPT0gLTEpIHtcclxuICAgICAgb3MgPSBcIldpbmRvd3NcIjtcclxuICAgIH0gZWxzZSBpZiAoL0FuZHJvaWQvLnRlc3QodXNlckFnZW50KSkge1xyXG4gICAgICBvcyA9IFwiQW5kcm9pZFwiO1xyXG4gICAgfSBlbHNlIGlmICghb3MgJiYgL0xpbnV4Ly50ZXN0KHBsYXRmb3JtKSkge1xyXG4gICAgICBvcyA9IFwiTGludXhcIjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3M7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBleHBvcnQgYSBnbG9iYWwgdmFyaWFibGUgdG8gYWNjZXNzIGxhdGVyXHJcbih3aW5kb3cgYXMgYW55KS5UcmFja1BlcmZvcm1hbmNlID0gVHJhY2tQZXJmb3JtYW5jZTtcclxuZXhwb3J0IGRlZmF1bHQgVHJhY2tQZXJmb3JtYW5jZTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==
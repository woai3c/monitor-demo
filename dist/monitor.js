var monitor = (function () {
  'use strict';

  var originalProto = XMLHttpRequest.prototype;
  var originalOpen = originalProto.open;
  var originalSend = originalProto.send;

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function deepCopy(target) {
    if (_typeof(target) === 'object') {
      var result = Array.isArray(target) ? [] : {};

      for (var key in target) {
        if (_typeof(target[key]) == 'object') {
          result[key] = deepCopy(target[key]);
        } else {
          result[key] = target[key];
        }
      }

      return result;
    }

    return target;
  }

  var cache = [];
  function getCache() {
    return deepCopy(cache);
  }
  function addCache(data) {
    cache.push(data);
  }
  function clearCache() {
    cache.length = 0;
  }

  function generateUniqueID() {
    return "v2-".concat(Date.now(), "-").concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12);
  }
  var sessionID = generateUniqueID();

  var config = {
    url: '',
    appID: '',
    userID: ''
  };
  function setConfig(options) {
    for (var key in config) {
      if (options[key]) {
        config[key] = options[key];
      }
    }
  }

  function isSupportSendBeacon() {
    var _window$navigator;

    return !!((_window$navigator = window.navigator) !== null && _window$navigator !== void 0 && _window$navigator.sendBeacon);
  }
  var sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : reportWithXHR;
  function report(data) {
    var isImmediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (!config.url) {
      console.error('请设置上传 url 地址');
    }

    var reportData = JSON.stringify({
      id: sessionID,
      appID: config.appID,
      userID: config.userID,
      data: data
    });

    if (isImmediate) {
      sendBeacon(config.url, reportData);
      return;
    }

    if (window.requestIdleCallback) {
      window.requestIdleCallback(function () {
        sendBeacon(config.url, reportData);
      }, {
        timeout: 3000
      });
    } else {
      setTimeout(function () {
        sendBeacon(config.url, reportData);
      });
    }
  }
  var timer = null;
  function lazyReportCache() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;
    clearTimeout(timer);
    timer = setTimeout(function () {
      var data = getCache();

      if (data.length) {
        report(data);
        clearCache();
      }
    }, timeout);
  }
  function reportWithXHR(data) {
    var xhr = new XMLHttpRequest();
    originalOpen.call(xhr, 'post', config.url);
    originalSend.call(xhr, JSON.stringify(data));
  }

  function error() {
    // 捕获资源加载失败错误 js css img...
    window.addEventListener('error', function (e) {
      var target = e.target;
      if (!target) return;
      var url = '';

      if (target.src || target.href) {
        url = target.src || target.href;
        console.log(url);
      }
    }, true); // 监听 js 错误

    window.onerror = function (msg, url, row, col, error) {
      console.log(msg, url, row, col, error);
      console.log(error);
    }; // 监听 promise 错误 缺点是获取不到列数据


    window.addEventListener('unhandledrejection', function (e) {
      console.log(e.reason);
    });
  }

  function isSupportPerformanceObserver() {
    return !!window.PerformanceObserver;
  }
  function executeAfterLoad(callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', function () {
        callback();
      }, true);
    }
  }
  function onBeforeunload(callback) {
    window.addEventListener('beforeunload', callback, true);
  }
  function onHidden(callback, once) {
    var onHiddenOrPageHide = function onHiddenOrPageHide(event) {
      if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
        callback(event);

        if (once) {
          window.removeEventListener('visibilitychange', onHiddenOrPageHide, true);
          window.removeEventListener('pagehide', onHiddenOrPageHide, true);
        }
      }
    };

    window.addEventListener('visibilitychange', onHiddenOrPageHide, true);
    window.addEventListener('pagehide', onHiddenOrPageHide, true);
  }

  function observeEntries() {
    observeEvent('resource');
    observeEvent('navigation');
  }
  function observeEvent(entryType) {
    function entryHandler(list) {
      var data = list.getEntries ? list.getEntries() : list;

      var _iterator = _createForOfIteratorHelper(data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          if (entryType === 'navigation' && observer) {
            observer.disconnect();
          } // 这两个参数为 0，说明资源解析错误或者跨域
          // beacon 用于上报数据，所以不统计


          if (entry.domainLookupStart && entry.connectStart === 0 || filter(entry.initiatorType)) {
            return;
          }

          addCache({
            name: entry.name,
            // 资源名称
            type: entryType,
            sourceType: entry.initiatorType,
            // 资源类型
            duration: entry.duration,
            // 资源加载耗时
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            // DNS 耗时
            tcp: entry.connectEnd - entry.connectStart,
            // 建立 tcp 连接耗时
            redirect: entry.redirectEnd - entry.redirectStart,
            // 重定向耗时
            ttfb: entry.responseStart,
            // 首字节时间
            protocol: entry.nextHopProtocol,
            // 请求协议
            responseBodySize: entry.encodedBodySize,
            // 响应内容大小
            responseHeaderSize: entry.transferSize - entry.encodedBodySize,
            // 响应头部大小
            resourceSize: entry.decodedBodySize,
            // 资源解压后的大小
            isCache: entry.transferSize === 0 // 是否命中缓存

          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      lazyReportCache();
    }

    var observer;

    if (isSupportPerformanceObserver()) {
      observer = new PerformanceObserver(entryHandler);
      observer.observe({
        type: entryType,
        buffered: true
      });
    } else {
      executeAfterLoad(function () {
        var data = window.performance.getEntriesByType(entryType);
        entryHandler(data);
        setTimeout(function () {
          if (entryType === 'resource') {
            // 收集数据后，清除资源的性能统计缓存
            window.performance.clearResourceTimings();
          }
        });
      });
    }
  } // 不统计以下类型的资源

  var preventType = ['fetch', 'xmlhttprequest', 'beacon'];

  function filter(type) {
    return preventType.includes(type);
  }

  function observePaint() {
    if (isSupportPerformanceObserver()) {
      var entryHandler = function entryHandler(list) {
        var _iterator = _createForOfIteratorHelper(list.getEntries()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;

            if (entry.name === 'first-contentful-paint') {
              observer.disconnect();
            }

            var json = entry.toJSON();
            delete json.duration;

            var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
              type: 'performance'
            });

            addCache(reportData);
            lazyReportCache();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };

      var observer = new PerformanceObserver(entryHandler);
      observer.observe({
        type: 'paint',
        buffered: true
      });
    }
  }

  function observeLCP() {
    if (!isSupportPerformanceObserver()) return;

    var entryHandler = function entryHandler(list) {
      if (observer) {
        observer.disconnect();
      }

      var _iterator = _createForOfIteratorHelper(list.getEntries()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          var json = entry.toJSON();
          delete json.duration;

          var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
            target: entry.element.localName,
            name: entry.entryType,
            type: 'performance'
          });

          addCache(reportData);
          lazyReportCache();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    var observer = new PerformanceObserver(entryHandler);
    observer.observe({
      type: 'largest-contentful-paint',
      buffered: true
    });
  }

  function observeCLS() {
    if (!isSupportPerformanceObserver()) return;
    var sessionValue = 0;
    var sessionEntries = [];
    var cls = {
      entryType: 'layout-shift',
      name: 'layout-shift',
      type: 'performance',
      value: 0
    };

    var entryHandler = function entryHandler(list) {
      var _iterator = _createForOfIteratorHelper(list.getEntries()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          // Only count layout shifts without recent user input.
          if (!entry.hadRecentInput) {
            var firstSessionEntry = sessionEntries[0];
            var lastSessionEntry = sessionEntries[sessionEntries.length - 1]; // If the entry occurred less than 1 second after the previous entry and
            // less than 5 seconds after the first entry in the session, include the
            // entry in the current session. Otherwise, start a new session.

            if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value;
              sessionEntries.push(formatCLSEntry(entry));
            } else {
              sessionValue = entry.value;
              sessionEntries = [formatCLSEntry(entry)];
            } // If the current session value is larger than the current CLS value,
            // update CLS and the entries contributing to it.


            if (sessionValue > cls.value) {
              cls.value = sessionValue;
              cls.entries = sessionEntries;
              addCache(cls);
              lazyReportCache();
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    };

    var observer = new PerformanceObserver(entryHandler);
    observer.observe({
      type: 'layout-shift',
      buffered: true
    });
  }

  function formatCLSEntry(entry) {
    var result = entry.toJSON();
    delete result.duration;
    delete result.sources;
    return result;
  }

  function observeFID() {
    if (!isSupportPerformanceObserver()) {
      var entryHandler = function entryHandler(list) {
        if (observer) {
          observer.disconnect();
        }

        var _iterator = _createForOfIteratorHelper(list.getEntries()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            var json = entry.toJSON();
            json.nodeName = entry.localName;
            json.event = json.name;
            json.name = json.entryType;
            json.type = 'performance';
            delete json.cancelable;
            addCache(json);
            lazyReportCache();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };

      var observer = new PerformanceObserver(entryHandler);
      observer.observe({
        type: 'first-input',
        buffered: true
      });
      return;
    }

    fidPolyfill();
  }

  function fidPolyfill() {
    eachEventType(window.addEventListener);
  }

  function onInput(event) {
    // Only count cancelable events, which should trigger behavior
    // important to the user.
    if (event.cancelable) {
      // In some browsers `event.timeStamp` returns a `DOMTimeStamp` value
      // (epoch time) instead of the newer `DOMHighResTimeStamp`
      // (document-origin time). To check for that we assume any timestamp
      // greater than 1 trillion is a `DOMTimeStamp`, and compare it using
      // the `Date` object rather than `performance.now()`.
      // - https://github.com/GoogleChromeLabs/first-input-delay/issues/4
      var isEpochTime = event.timeStamp > 1e12;
      var now = isEpochTime ? Date.now() : performance.now(); // Input delay is the delta between when the system received the event
      // (e.g. event.timeStamp) and when it could run the callback (e.g. `now`).

      var duration = now - event.timeStamp;
      addCache({
        duration: duration,
        entryType: 'first-input',
        event: event.type,
        name: 'first-input',
        target: event.target.localName,
        startTime: event.timeStamp,
        type: 'performance'
      });
      lazyReportCache();
      eachEventType(window.removeEventListener);
    }
  }

  function eachEventType(callback) {
    var eventTypes = ['mousedown', 'keydown', 'touchstart'];
    eventTypes.forEach(function (type) {
      return callback(type, onInput, {
        passive: true,
        capture: true
      });
    });
  }

  function overwriteOpenAndSend() {
    originalProto.open = function newOpen() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.url = args[1];
      this.method = args[0];
      originalOpen.apply(this, args);
    };

    originalProto.send = function newSend() {
      var _this = this;

      this.startTime = Date.now();

      var onLoadend = function onLoadend() {
        _this.endTime = Date.now();
        _this.duration = _this.endTime - _this.startTime;
        var status = _this.status,
            duration = _this.duration,
            startTime = _this.startTime,
            endTime = _this.endTime,
            url = _this.url,
            method = _this.method;
        var reportData = {
          status: status,
          duration: duration,
          startTime: startTime,
          endTime: endTime,
          url: url,
          method: method,
          success: status >= 200 && status < 300,
          type: 'xhr'
        };
        addCache(reportData);
        lazyReportCache();

        _this.removeEventListener('loadend', onLoadend, true);
      };

      this.addEventListener('loadend', onLoadend, true);

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      originalSend.apply(this, args);
    };
  }

  function xhr() {
    overwriteOpenAndSend();
  }

  var originalFetch = window.fetch;

  function overwriteFetch() {
    window.fetch = function newFetch(url, config) {
      var startTime = Date.now();
      var reportData = {
        startTime: startTime,
        url: url,
        method: (config === null || config === void 0 ? void 0 : config.method) || 'GET',
        type: 'fetch'
      };
      return originalFetch(url, config).then(function (res) {
        reportData.endTime = Date.now();
        reportData.duration = reportData.endTime - reportData.startTime;
        var data = res.clone();
        reportData.status = data.status;
        reportData.success = data.ok;
        addCache(reportData);
        lazyReportCache();
        return res;
      }).catch(function (err) {
        reportData.endTime = Date.now();
        reportData.duration = reportData.endTime - reportData.startTime;
        reportData.status = 0;
        reportData.success = false;
        addCache(reportData);
        lazyReportCache();
        throw err;
      });
    };
  }

  function fetch() {
    overwriteFetch();
  }

  var next = window.requestAnimationFrame ? window.requestAnimationFrame : function (callback) {
    setTimeout(callback, 1000 / 60);
  };
  var frames = [];
  function fps() {
    var frame = 0;
    var lastSecond = Date.now();

    function calculateFPS() {
      frame++;
      var now = Date.now();

      if (lastSecond + 1000 <= now) {
        // 由于 now - lastSecond 的单位是毫秒，所以 frame 要 * 1000
        var _fps = Math.round(frame * 1000 / (now - lastSecond));

        frames.push(_fps);
        frame = 0;
        lastSecond = now;
      } // 避免上报太快，缓存一定数量再上报


      if (frames.length >= 60) {
        report(deepCopy({
          frames: frames,
          type: 'performace',
          subType: 'fps'
        }));
        frames.length = 0;
      }

      next(calculateFPS);
    }

    calculateFPS();
  }

  function performance$1() {
    observeEntries();
    observePaint();
    observeLCP();
    observeCLS();
    observeFID();
    xhr();
    fetch();
    fps();

    if (isSupportSendBeacon()) {
      [onBeforeunload, onHidden].forEach(function (fn) {
        fn(function () {
          var data = getCache();

          if (data.length) {
            report(data, true);
            clearCache();
          }
        });
      });
    }
  }

  var monitor = {
    init: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      setConfig(options);
      error();
      performance$1();
    }
  };

  return monitor;

})();

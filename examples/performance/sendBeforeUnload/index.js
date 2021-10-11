/* eslint-disable max-len */
const reportData = `(function () {
    let originalProto = XMLHttpRequest.prototype
    let originalOpen = originalProto.open
    let originalSend = originalProto.send
  
    function ownKeys(object, enumerableOnly) {
        let keys = Object.keys(object)
  
        if (Object.getOwnPropertySymbols) {
            let symbols = Object.getOwnPropertySymbols(object)
  
            if (enumerableOnly) {
                symbols = symbols.filter((sym) => Object.getOwnPropertyDescriptor(object, sym).enumerable)
            }
  
            keys.push.apply(keys, symbols)
        }
  
        return keys
    }
  
    function _objectSpread2(target) {
        for (let i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {}
  
            if (i % 2) {
                ownKeys(Object(source), true).forEach((key) => {
                    _defineProperty(target, key, source[key])
                })
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
            } else {
                ownKeys(Object(source)).forEach((key) => {
                    Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
                })
            }
        }
  
        return target
    }
  
    function _typeof(obj) {
        '@babel/helpers - typeof'
  
        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function (obj) {
                return typeof obj
            }
        } else {
            _typeof = function (obj) {
                return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
            }
        }
  
        return _typeof(obj)
    }
  
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value,
                enumerable: true,
                configurable: true,
                writable: true,
            })
        } else {
            obj[key] = value
        }
  
        return obj
    }
  
    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return
        if (typeof o === 'string') return _arrayLikeToArray(o, minLen)
        let n = Object.prototype.toString.call(o).slice(8, -1)
        if (n === 'Object' && o.constructor) n = o.constructor.name
        if (n === 'Map' || n === 'Set') return Array.from(o)
        if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen)
    }
  
    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length
  
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]
  
        return arr2
    }
  
    function _createForOfIteratorHelper(o, allowArrayLike) {
        let it = typeof Symbol !== 'undefined' && o[Symbol.iterator] || o['@@iterator']
  
        if (!it) {
            if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === 'number') {
                if (it) o = it
                let i = 0
  
                let F = function () {}
  
                return {
                    s: F,
                    n() {
                        if (i >= o.length) {
                            return {
                                done: true,
                            } 
                        }
                        return {
                            done: false,
                            value: o[i++],
                        }
                    },
                    e(e) {
                        throw e
                    },
                    f: F,
                }
            }
  
            throw new TypeError('Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.')
        }
  
        let normalCompletion = true,
            didErr = false,
            err
        return {
            s() {
                it = it.call(o)
            },
            n() {
                let step = it.next()
                normalCompletion = step.done
                return step
            },
            e(e) {
                didErr = true
                err = e
            },
            f() {
                try {
                    if (!normalCompletion && it.return != null) it.return()
                } finally {
                    if (didErr) throw err
                }
            },
        }
    }
  
    function deepCopy(target) {
        if (_typeof(target) === 'object') {
            let result = Array.isArray(target) ? [] : {}
  
            for (let key in target) {
                if (_typeof(target[key]) == 'object') {
                    result[key] = deepCopy(target[key])
                } else {
                    result[key] = target[key]
                }
            }
  
            return result
        }
  
        return target
    }
    function onBFCacheRestore(callback) {
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                callback(event)
            }
        }, true)
    }
    function onBeforeunload(callback) {
        window.addEventListener('beforeunload', callback, true)
    }
    function onHidden(callback, once) {
        let onHiddenOrPageHide = function onHiddenOrPageHide(event) {
            if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
                callback(event)
  
                if (once) {
                    window.removeEventListener('visibilitychange', onHiddenOrPageHide, true)
                    window.removeEventListener('pagehide', onHiddenOrPageHide, true)
                }
            }
        }
  
        window.addEventListener('visibilitychange', onHiddenOrPageHide, true)
        window.addEventListener('pagehide', onHiddenOrPageHide, true)
    }
    function executeAfterLoad(callback) {
        if (document.readyState === 'complete') {
            callback()
        } else {
            let onLoad = function onLoad() {
                callback()
                window.removeEventListener('load', onLoad, true)
            }
  
            window.addEventListener('load', onLoad, true)
        }
    }
    function getPageURL() {
        return window.location.href
    }
  
    let cache = []
    function getCache() {
        return deepCopy(cache)
    }
    function addCache(data) {
        cache.push(data)
    }
    function clearCache() {
        cache.length = 0
    }
  
    function generateUniqueID() {
        return 'v2-'.concat(Date.now(), '-').concat(Math.floor(Math.random() * (9e12 - 1)) + 1e12)
    }
  
    let config = {
        url: '',
        appID: '',
        userID: '',
        vue: {
            Vue: null,
            router: null,
        },
    }
    function setConfig(options) {
        for (let key in config) {
            if (options[key]) {
                config[key] = options[key]
            }
        }
    }
  
    function isSupportSendBeacon() {
        let _window$navigator
  
        return !!((_window$navigator = window.navigator) !== null && _window$navigator !== void 0 && _window$navigator.sendBeacon)
    }
    let sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : reportWithXHR
    let sessionID = generateUniqueID()
    function report(data) {
        let isImmediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false
  
        if (!config.url) {
            console.error('请设置上传 url 地址')
        }
  
        let reportData = JSON.stringify({
            id: sessionID,
            appID: config.appID,
            userID: config.userID,
            data,
        })
  
        if (isImmediate) {
            sendBeacon(config.url, reportData)
            return
        }
  
        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                sendBeacon(config.url, reportData)
            }, {
                timeout: 3000,
            })
        } else {
            setTimeout(() => {
                sendBeacon(config.url, reportData)
            })
        }
    }
    let timer$2 = null
    function lazyReportCache(data) {
        let timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000
        addCache(data)
        clearTimeout(timer$2)
        timer$2 = setTimeout(() => {
            let data = getCache()
  
            if (data.length) {
                report(data)
                clearCache()
            }
        }, timeout)
    }
    function reportWithXHR(data) {
        let xhr = new XMLHttpRequest()
        originalOpen.call(xhr, 'post', config.url)
        originalSend.call(xhr, JSON.stringify(data))
    }
  
    function error() {
        let _this = this,
            _config$vue
  
        let oldConsoleError = window.console.error
  
        window.console.error = function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key]
            }
  
            oldConsoleError.apply(_this, args)
            lazyReportCache({
                type: 'error',
                subType: 'console-error',
                startTime: performance.now(),
                errData: args,
                pageURL: getPageURL(),
            })
        } // 捕获资源加载失败错误 js css img...
  
        window.addEventListener('error', (e) => {
            let target = e.target
            if (!target) return
  
            if (target.src || target.href) {
                let url = target.src || target.href
                lazyReportCache({
                    url,
                    type: 'error',
                    subType: 'resource',
                    startTime: e.timeStamp,
                    html: target.outerHTML,
                    resourceType: target.tagName,
                    paths: e.path.map((item) => item.tagName).filter(Boolean),
                    pageURL: getPageURL(),
                })
            }
        }, true) // 监听 js 错误
  
        window.onerror = function (msg, url, line, column, error) {
            lazyReportCache({
                msg,
                line,
                column,
                error: error.stack,
                subType: 'js',
                pageURL: url,
                type: 'error',
                startTime: performance.now(),
            })
        } // 监听 promise 错误 缺点是获取不到列数据
  
        window.addEventListener('unhandledrejection', (e) => {
            let _e$reason
  
            lazyReportCache({
                reason: (_e$reason = e.reason) === null || _e$reason === void 0 ? void 0 : _e$reason.stack,
                subType: 'promise',
                type: 'error',
                startTime: e.timeStamp,
                pageURL: getPageURL(),
            })
        })
  
        if ((_config$vue = config.vue) !== null && _config$vue !== void 0 && _config$vue.Vue) {
            config.vue.Vue.config.errorHandler = function (err, vm, info) {
                console.error(err)
                lazyReportCache({
                    info,
                    error: err.stack,
                    subType: 'vue',
                    type: 'error',
                    startTime: performance.now(),
                    pageURL: getPageURL(),
                })
            }
        }
  
        onBFCacheRestore(() => {
            error()
        })
    }
  
    function isSupportPerformanceObserver() {
        return !!window.PerformanceObserver
    }
  
    function observeEntries() {
        executeAfterLoad(() => {
            observeEvent('resource')
            observeEvent('navigation')
        })
    }
    let hasAlreadyCollected = false
    function observeEvent(entryType) {
        function entryHandler(list) {
            let data = list.getEntries ? list.getEntries() : list
  
            let _iterator = _createForOfIteratorHelper(data),
                _step
  
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    let entry = _step.value
  
                    if (entryType === 'navigation') {
                        if (hasAlreadyCollected) return
  
                        if (observer) {
                            observer.disconnect()
                        }
  
                        hasAlreadyCollected = true
                    } // nextHopProtocol 属性为空，说明资源解析错误或者跨域
                    // beacon 用于上报数据，所以不统计。xhr fetch 单独统计
  
                    if (!entry.nextHopProtocol && entryType !== 'navigation' || filter(entry.initiatorType)) {
                        return
                    }
  
                    lazyReportCache({
                        name: entry.name,
                        // 资源名称
                        subType: entryType,
                        type: 'performance',
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
                        isCache: isCache(entry),
                        // 是否命中缓存
                        startTime: performance.now(),
                    })
                }
            } catch (err) {
                _iterator.e(err)
            } finally {
                _iterator.f()
            }
        }
  
        let observer
  
        if (isSupportPerformanceObserver()) {
            observer = new PerformanceObserver(entryHandler)
            observer.observe({
                type: entryType,
                buffered: true,
            })
        } else {
            let data = window.performance.getEntriesByType(entryType)
            entryHandler(data)
        }
    } // 不统计以下类型的资源
  
    let preventType = ['fetch', 'xmlhttprequest', 'beacon']
    let isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  
    if (isSafari) {
        // safari 会把接口请求当成 other
        preventType.push('other')
    }
  
    function filter(type) {
        return preventType.includes(type)
    }
  
    function isCache(entry) {
        // 直接从缓存读取或 304
        return entry.transferSize === 0 || entry.transferSize !== 0 && entry.encodedBodySize === 0
    }
  
    function observePaint() {
        if (!isSupportPerformanceObserver()) return
  
        let entryHandler = function entryHandler(list) {
            let _iterator = _createForOfIteratorHelper(list.getEntries()),
                _step
  
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    let entry = _step.value
  
                    if (entry.name === 'first-contentful-paint') {
                        observer.disconnect()
                    }
  
                    let json = entry.toJSON()
                    delete json.duration
  
                    let reportData = _objectSpread2(_objectSpread2({}, json), {}, {
                        subType: entry.name,
                        type: 'performance',
                        pageURL: getPageURL(),
                    })
  
                    lazyReportCache(reportData)
                }
            } catch (err) {
                _iterator.e(err)
            } finally {
                _iterator.f()
            }
        }
  
        var observer = new PerformanceObserver(entryHandler)
        observer.observe({
            type: 'paint',
            buffered: true,
        })
        onBFCacheRestore((event) => {
            requestAnimationFrame(() => {
                ['first-paint', 'first-contentful-paint'].forEach((type) => {
                    lazyReportCache({
                        startTime: performance.now() - event.timeStamp,
                        name: type,
                        subType: type,
                        type: 'performance',
                        pageURL: getPageURL(),
                        bfc: true,
                    })
                })
            })
        })
    }
  
    let lcpDone = false
    function isLCPDone() {
        return lcpDone
    }
    function observeLCP() {
        if (!isSupportPerformanceObserver()) {
            lcpDone = true
            return
        }
  
        let entryHandler = function entryHandler(list) {
            lcpDone = true
  
            if (observer) {
                observer.disconnect()
            }
  
            let _iterator = _createForOfIteratorHelper(list.getEntries()),
                _step
  
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    var _entry$element
  
                    let entry = _step.value
                    let json = entry.toJSON()
                    delete json.duration
  
                    let reportData = _objectSpread2(_objectSpread2({}, json), {}, {
                        target: (_entry$element = entry.element) === null || _entry$element === void 0 ? void 0 : _entry$element.tagName,
                        name: entry.entryType,
                        subType: entry.entryType,
                        type: 'performance',
                        pageURL: getPageURL(),
                    })
  
                    lazyReportCache(reportData)
                }
            } catch (err) {
                _iterator.e(err)
            } finally {
                _iterator.f()
            }
        }
  
        var observer = new PerformanceObserver(entryHandler)
        observer.observe({
            type: 'largest-contentful-paint',
            buffered: true,
        })
        onBFCacheRestore((event) => {
            requestAnimationFrame(() => {
                lazyReportCache({
                    startTime: performance.now() - event.timeStamp,
                    name: 'largest-contentful-paint',
                    subType: 'largest-contentful-paint',
                    type: 'performance',
                    pageURL: getPageURL(),
                    bfc: true,
                })
            })
        })
    }
  
    function observeCLS() {
        if (!isSupportPerformanceObserver()) return
        onBFCacheRestore(() => {
            observeCLS()
        })
        let sessionValue = 0
        let sessionEntries = []
        let cls = {
            subType: 'layout-shift',
            name: 'layout-shift',
            type: 'performance',
            pageURL: getPageURL(),
            value: 0,
        }
  
        let entryHandler = function entryHandler(list) {
            let _iterator = _createForOfIteratorHelper(list.getEntries()),
                _step
  
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    let entry = _step.value
  
                    // Only count layout shifts without recent user input.
                    if (!entry.hadRecentInput) {
                        let firstSessionEntry = sessionEntries[0]
                        let lastSessionEntry = sessionEntries[sessionEntries.length - 1] // If the entry occurred less than 1 second after the previous entry and
                        // less than 5 seconds after the first entry in the session, include the
                        // entry in the current session. Otherwise, start a new session.
  
                        if (sessionValue && entry.startTime - lastSessionEntry.startTime < 1000 && entry.startTime - firstSessionEntry.startTime < 5000) {
                            sessionValue += entry.value
                            sessionEntries.push(formatCLSEntry(entry))
                        } else {
                            sessionValue = entry.value
                            sessionEntries = [formatCLSEntry(entry)]
                        } // If the current session value is larger than the current CLS value,
                        // update CLS and the entries contributing to it.
  
                        if (sessionValue > cls.value) {
                            cls.value = sessionValue
                            cls.entries = sessionEntries
                            cls.startTime = performance.now()
                            lazyReportCache(deepCopy(cls))
                        }
                    }
                }
            } catch (err) {
                _iterator.e(err)
            } finally {
                _iterator.f()
            }
        }
  
        let observer = new PerformanceObserver(entryHandler)
        observer.observe({
            type: 'layout-shift',
            buffered: true,
        })
    }
  
    function formatCLSEntry(entry) {
        let result = entry.toJSON()
        delete result.duration
        delete result.sources
        return result
    }
  
    function observeFID() {
        onBFCacheRestore(() => {
            observeFID()
        })
  
        if (!isSupportPerformanceObserver()) {
            let entryHandler = function entryHandler(list) {
                if (observer) {
                    observer.disconnect()
                }
  
                let _iterator = _createForOfIteratorHelper(list.getEntries()),
                    _step
  
                try {
                    for (_iterator.s(); !(_step = _iterator.n()).done;) {
                        let entry = _step.value
                        let json = entry.toJSON()
                        json.nodeName = entry.tagName
                        json.event = json.name
                        json.name = json.entryType
                        json.type = 'performance'
                        json.pageURL = getPageURL()
                        delete json.cancelable
                        lazyReportCache(json)
                    }
                } catch (err) {
                    _iterator.e(err)
                } finally {
                    _iterator.f()
                }
            }
  
            var observer = new PerformanceObserver(entryHandler)
            observer.observe({
                type: 'first-input',
                buffered: true,
            })
            return
        }
  
        fidPolyfill()
    }
  
    function fidPolyfill() {
        eachEventType(window.addEventListener)
    }
  
    function onInput(event) {
        // Only count cancelable events, which should trigger behavior
        // important to the user.
        if (event.cancelable) {
            let duration = now - event.timeStamp
            lazyReportCache({
                duration,
                subType: 'first-input',
                event: event.type,
                name: 'first-input',
                target: event.target.tagName,
                startTime: event.timeStamp,
                type: 'performance',
                pageURL: getPageURL(),
            })
            eachEventType(window.removeEventListener)
        }
    }
  
    function eachEventType(callback) {
        let eventTypes = ['mousedown', 'keydown', 'touchstart']
        eventTypes.forEach((type) => callback(type, onInput, {
            passive: true,
            capture: true,
        }))
    }
  
    function observerLoad() {
        ['load', 'DOMContentLoaded'].forEach((type) => onEvent(type))
        onBFCacheRestore((event) => {
            requestAnimationFrame(() => {
                ['load', 'DOMContentLoaded'].forEach((type) => {
                    lazyReportCache({
                        startTime: performance.now() - event.timeStamp,
                        subType: type.toLocaleLowerCase(),
                        type: 'performance',
                        pageURL: getPageURL(),
                        bfc: true,
                    })
                })
            })
        })
    }
  
    function onEvent(type) {
        function callback() {
            lazyReportCache({
                type: 'performance',
                subType: type.toLocaleLowerCase(),
                startTime: performance.now(),
            })
            window.removeEventListener(type, callback, true)
        }
  
        window.addEventListener(type, callback, true)
    }
  
    let isOnLoaded = false
    executeAfterLoad(() => {
        isOnLoaded = true
    })
    let timer$1
    let observer
  
    function checkDOMChange() {
        clearTimeout(timer$1)
        timer$1 = setTimeout(() => {
        // 等 load、lcp 事件触发后并且 DOM 树不再变化时，计算首屏渲染时间
            if (isOnLoaded && isLCPDone()) {
                observer && observer.disconnect()
                lazyReportCache({
                    type: 'performance',
                    subType: 'first-screen-paint',
                    startTime: getRenderTime(),
                    pageURL: getPageURL(),
                })
                entries = null
            } else {
                checkDOMChange()
            }
        }, 500)
    }
  
    var entries = []
    function observeFirstScreenPaint() {
        if (!MutationObserver) return
        let next = window.requestAnimationFrame ? requestAnimationFrame : setTimeout
        let ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK']
        observer = new MutationObserver((mutationList) => {
            checkDOMChange()
            let entry = {
                children: [],
            }
  
            let _iterator = _createForOfIteratorHelper(mutationList),
                _step
  
            try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                    let mutation = _step.value
  
                    if (mutation.addedNodes.length && isInScreen(mutation.target)) {
                        var _iterator2 = _createForOfIteratorHelper(mutation.addedNodes),
                            _step2
  
                        try {
                            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                                let node = _step2.value
  
                                if (node.nodeType === 1 && !ignoreDOMList.includes(node.tagName) && isInScreen(node)) {
                                    entry.children.push(node)
                                }
                            }
                        } catch (err) {
                            _iterator2.e(err)
                        } finally {
                            _iterator2.f()
                        }
                    }
                }
            } catch (err) {
                _iterator.e(err)
            } finally {
                _iterator.f()
            }
  
            if (entry.children.length) {
                entries.push(entry)
                next(() => {
                    entry.startTime = performance.now()
                })
            }
        })
        observer.observe(document, {
            childList: true,
            subtree: true,
        })
        onBFCacheRestore((event) => {
            requestAnimationFrame(() => {
                lazyReportCache({
                    startTime: performance.now() - event.timeStamp,
                    type: 'performance',
                    subType: 'first-screen-paint',
                    bfc: true,
                    pageURL: getPageURL(),
                })
            })
        })
    }
  
    function getRenderTime() {
        let startTime = 0
        entries.forEach((entry) => {
            if (entry.startTime > startTime) {
                startTime = entry.startTime
            }
        }) // 需要和当前页面所有加载图片的时间做对比，取最大值
        // 图片请求时间要小于 startTime，响应结束时间要大于 startTime
  
        performance.getEntriesByType('resource').forEach((item) => {
            if (item.initiatorType === 'img' && item.fetchStart < startTime && item.responseEnd > startTime) {
                startTime = item.responseEnd
            }
        })
        return startTime
    }
  
    let viewportWidth = window.innerWidth
    let viewportHeight$1 = window.innerHeight // dom 对象是否在屏幕内
  
    function isInScreen(dom) {
        let rectInfo = dom.getBoundingClientRect()
  
        if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight$1) {
            return true
        }
  
        return false
    }
  
    function overwriteOpenAndSend() {
        originalProto.open = function newOpen() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key]
            }
  
            this.url = args[1]
            this.method = args[0]
            originalOpen.apply(this, args)
        }
  
        originalProto.send = function newSend() {
            let _this = this
  
            this.startTime = Date.now()
  
            let onLoadend = function onLoadend() {
                _this.endTime = Date.now()
                _this.duration = _this.endTime - _this.startTime
                let status = _this.status,
                    duration = _this.duration,
                    startTime = _this.startTime,
                    endTime = _this.endTime,
                    url = _this.url,
                    method = _this.method
                let reportData = {
                    status,
                    duration,
                    startTime,
                    endTime,
                    url,
                    method: (method || 'GET').toUpperCase(),
                    success: status >= 200 && status < 300,
                    subType: 'xhr',
                    type: 'performance',
                }
                lazyReportCache(reportData)
  
                _this.removeEventListener('loadend', onLoadend, true)
            }
  
            this.addEventListener('loadend', onLoadend, true)
  
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2]
            }
  
            originalSend.apply(this, args)
        }
    }
  
    function xhr() {
        overwriteOpenAndSend()
    }
  
    let originalFetch = window.fetch
  
    function overwriteFetch() {
        window.fetch = function newFetch(url, config) {
            let startTime = Date.now()
            let reportData = {
                startTime,
                url,
                method: ((config === null || config === void 0 ? void 0 : config.method) || 'GET').toUpperCase(),
                subType: 'fetch',
                type: 'performance',
            }
            return originalFetch(url, config).then((res) => {
                reportData.endTime = Date.now()
                reportData.duration = reportData.endTime - reportData.startTime
                let data = res.clone()
                reportData.status = data.status
                reportData.success = data.ok
                lazyReportCache(reportData)
                return res
            }).catch((err) => {
                reportData.endTime = Date.now()
                reportData.duration = reportData.endTime - reportData.startTime
                reportData.status = 0
                reportData.success = false
                lazyReportCache(reportData)
                throw err
            })
        }
    }
  
    function fetch() {
        overwriteFetch()
    }
  
    let next = window.requestAnimationFrame ? requestAnimationFrame : function (callback) {
        setTimeout(callback, 1000 / 60)
    }
    let frames = []
    function fps() {
        let frame = 0
        let lastSecond = Date.now()
  
        function calculateFPS() {
            frame++
            let now = Date.now()
  
            if (lastSecond + 1000 <= now) {
                // 由于 now - lastSecond 的单位是毫秒，所以 frame 要 * 1000
                let _fps = Math.round(frame * 1000 / (now - lastSecond))
  
                frames.push(_fps)
                frame = 0
                lastSecond = now
            } // 避免上报太快，缓存一定数量再上报
  
            if (frames.length >= 60) {
                report(deepCopy({
                    frames,
                    type: 'performace',
                    subType: 'fps',
                }))
                frames.length = 0
            }
  
            next(calculateFPS)
        }
  
        calculateFPS()
    }
  
    function onVueRouter$1(Vue, router) {
        let isFirst = true
        let startTime
        router.beforeEach((to, from, next) => {
        // 首次进入页面已经有其他统计的渲染时间可用
            if (isFirst) {
                isFirst = false
                return next()
            } // 给 router 新增一个字段，表示是否要计算渲染时间
            // 只有路由跳转才需要计算
  
            router.needCalculateRenderTime = true
            startTime = performance.now()
            next()
        })
        let timer
        Vue.mixin({
            mounted: function mounted() {
                if (!router.needCalculateRenderTime) return
                this.$nextTick(() => {
                    // 仅在整个视图都被渲染之后才会运行的代码
                    let now = performance.now()
                    clearTimeout(timer)
                    timer = setTimeout(() => {
                        router.needCalculateRenderTime = false
                        lazyReportCache({
                            type: 'performance',
                            subType: 'vue-router-change-paint',
                            duration: now - startTime,
                            startTime: now,
                            pageURL: getPageURL(),
                        })
                    }, 1000)
                })
            },
        })
    }
  
    function performance$1() {
        let _config$vue, _config$vue2
  
        observeEntries()
        observePaint()
        observeLCP()
        observeCLS()
        observeFID()
        xhr()
        fetch()
        fps()
        observerLoad()
        observeFirstScreenPaint()
  
        if ((_config$vue = config.vue) !== null && _config$vue !== void 0 && _config$vue.Vue && (_config$vue2 = config.vue) !== null && _config$vue2 !== void 0 && _config$vue2.router) {
            onVueRouter$1(config.vue.Vue, config.vue.router)
        }
    }
  
    let uuid = ''
    function getUUID() {
        if (uuid) return uuid // 如果是手机 APP，可以调用原生方法或者设备唯一标识当成 uuid
  
        uuid = localStorage.getItem('uuid')
        if (uuid) return uuid
        uuid = generateUniqueID()
        localStorage.setItem('uuid', uuid)
        return uuid
    }
  
    function pv() {
        lazyReportCache({
            type: 'behavior',
            subType: 'pv',
            startTime: performance.now(),
            pageURL: getPageURL(),
            referrer: document.referrer,
            uuid: getUUID(),
        })
    }
  
    function pageAccessDuration() {
        onBeforeunload(() => {
            report({
                type: 'behavior',
                subType: 'page-access-duration',
                startTime: performance.now(),
                pageURL: getPageURL(),
                uuid: getUUID(),
            }, true)
        })
    }
  
    let timer
    let startTime = 0
    let hasReport = false
    let pageHeight = 0
    let scrollTop = 0
    let viewportHeight = 0
    function pageAccessHeight() {
        window.addEventListener('scroll', onScroll)
        onBeforeunload(() => {
            let now = performance.now()
            report({
                startTime: now,
                duration: now - startTime,
                type: 'behavior',
                subType: 'page-access-height',
                pageURL: getPageURL(),
                value: toPercent((scrollTop + viewportHeight) / pageHeight),
                uuid: getUUID(),
            }, true)
        }) // 页面加载完成后初始化记录当前访问高度、时间
  
        executeAfterLoad(() => {
            startTime = performance.now()
            pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            viewportHeight = window.innerHeight
        })
    }
  
    function onScroll() {
        clearTimeout(timer)
        let now = performance.now()
  
        if (!hasReport) {
            hasReport = true
            lazyReportCache({
                startTime: now,
                duration: now - startTime,
                type: 'behavior',
                subType: 'page-access-height',
                pageURL: getPageURL(),
                value: toPercent((scrollTop + viewportHeight) / pageHeight),
                uuid: getUUID(),
            })
        }
  
        timer = setTimeout(() => {
            hasReport = false
            startTime = now
            pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            viewportHeight = window.innerHeight
        }, 500)
    }
  
    function toPercent(val) {
        if (val >= 1) return '100%'
        return (val * 100).toFixed(2) + '%'
    }
  
    function onClick() {
        ['mousedown', 'touchstart'].forEach((eventType) => {
            let timer
            window.addEventListener(eventType, (event) => {
                clearTimeout(timer)
                timer = setTimeout(() => {
                    let _event$path
  
                    let target = event.target
  
                    let _target$getBoundingCl = target.getBoundingClientRect(),
                        top = _target$getBoundingCl.top,
                        left = _target$getBoundingCl.left
  
                    lazyReportCache({
                        top,
                        left,
                        eventType,
                        pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
                        scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                        type: 'behavior',
                        subType: 'click',
                        target: target.tagName,
                        paths: (_event$path = event.path) === null || _event$path === void 0 ? void 0 : _event$path.map((item) => item.tagName).filter(Boolean),
                        startTime: event.timeStamp,
                        pageURL: getPageURL(),
                        outerHTML: target.outerHTML,
                        innerHTML: target.innerHTML,
                        width: target.offsetWidth,
                        height: target.offsetHeight,
                        viewport: {
                            width: window.innerWidth,
                            height: window.innerHeight,
                        },
                        uuid: getUUID(),
                    })
                }, 500)
            })
        })
    }
  
    function onVueRouter(router) {
        router.beforeEach((to, from, next) => {
        // 首次加载页面不用统计
            if (!from.name) {
                return next()
            }
  
            let data = {
                params: to.params,
                query: to.query,
            }
            lazyReportCache({
                data,
                name: to.name || to.path,
                type: 'behavior',
                subType: ['vue-router-change', 'pv'],
                startTime: performance.now(),
                from: from.fullPath,
                to: to.fullPath,
                uuid: getUUID(),
            })
            next()
        })
    }
  
    function pageChange() {
        let from = ''
        window.addEventListener('popstate', () => {
            let to = getPageURL()
            lazyReportCache({
                from,
                to,
                type: 'behavior',
                subType: 'popstate',
                startTime: performance.now(),
                uuid: getUUID(),
            })
            from = to
        }, true)
        let oldURL = ''
        window.addEventListener('hashchange', (event) => {
            let newURL = event.newURL
            lazyReportCache({
                from: oldURL,
                to: newURL,
                type: 'behavior',
                subType: 'hashchange',
                startTime: performance.now(),
                uuid: getUUID(),
            })
            oldURL = newURL
        }, true)
    }
  
    function behavior() {
        let _config$vue
  
        pv()
        pageAccessDuration()
        pageAccessHeight()
        onClick()
        pageChange()
  
        if ((_config$vue = config.vue) !== null && _config$vue !== void 0 && _config$vue.router) {
            onVueRouter(config.vue.router)
        }
    }
  
    let monitor = {
        init: function init() {
            let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}
            setConfig(options)
            error()
            performance$1()
            behavior(); // 当页面进入后台或关闭前时，将所有的 cache 数据进行上报
  
            [onBeforeunload, onHidden].forEach((fn) => {
                fn(() => {
                    let data = getCache()
  
                    if (data.length) {
                        report(data, true)
                        clearCache()
                    }
                })
            })
        },
    }
  
    return monitor
}())`

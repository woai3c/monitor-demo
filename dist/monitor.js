var monitor = (function () {
    'use strict';

    const originalProto = XMLHttpRequest.prototype;
    const originalOpen = originalProto.open;
    const originalSend = originalProto.send;

    function deepCopy(target) {
        if (typeof target === 'object') {
            const result = Array.isArray(target) ? [] : {};
            for (const key in target) {
                if (typeof target[key] == 'object') {
                    result[key] = deepCopy(target[key]);
                } else {
                    result[key] = target[key];
                }
            }

            return result
        }

        return target
    }

    const cache = [];

    function getCache() {
        return deepCopy(cache)
    }

    function addCache(data) {
        cache.push(data);
    }

    function clearCache() {
        cache.length = 0;
    }

    function generateUniqueID() {
        return `v2-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`
    }

    const sessionID = generateUniqueID();

    const config = {
        url: '',
        appID: '',
        userID: '',
        Vue: null,
    };

    function setConfig(options) {
        for (const key in config) {
            if (options[key]) {
                config[key] = options[key];
            }
        }
    }

    function isSupportSendBeacon() {
        return !!window.navigator?.sendBeacon
    }

    const sendBeacon = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : reportWithXHR;

    function report(data, isImmediate = false) {
        if (!config.url) {
            console.error('请设置上传 url 地址');
        }

        const reportData = JSON.stringify({
            id: sessionID,
            appID: config.appID,
            userID: config.userID,
            data,
        });
        
        if (isImmediate) {
            sendBeacon(config.url, reportData);
            return
        }

        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
                sendBeacon(config.url, reportData);
            }, { timeout: 3000 });
        } else {
            setTimeout(() => {
                sendBeacon(config.url, reportData);
            });
        }
    }

    let timer$1 = null;
    function lazyReportCache(data, timeout = 3000) {
        addCache(data);

        clearTimeout(timer$1);
        timer$1 = setTimeout(() => {
            const data = getCache();
            if (data.length) {
                report(data);
                clearCache();
            }
        }, timeout);
    }

    function reportWithXHR(data) {
        const xhr = new XMLHttpRequest();
        originalOpen.call(xhr, 'post', config.url);
        originalSend.call(xhr, JSON.stringify(data));
    }

    function error() {
        // 捕获资源加载失败错误 js css img...
        window.addEventListener('error', e => {
            const target = e.target;
            if (!target) return

            if (target.src || target.href) {
                const url = target.src || target.href;
                report({
                    url,
                    type: 'error',
                    subType: 'resource',
                    startTime: e.timeStamp,
                    html: target.outerHTML,
                    resourceType: target.localName,
                    paths: e.path.map(item => item.localName).filter(Boolean),
                    pageURL: window.location.href,
                });
            }
        }, true);

        // 监听 js 错误
        window.onerror = (msg, url, line, column, error) => {
            report({
                msg,
                line,
                column,
                error: error.stack,
                subType: 'js',
                pageURL: url,
                type: 'error',
                startTime: performance.now(),
            });
        };

        // 监听 promise 错误 缺点是获取不到列数据
        window.addEventListener('unhandledrejection', e => {
            report({
                reason: e.reason?.stack,
                subType: 'promise',
                type: 'error',
                startTime: e.timeStamp,
            });
        });

        if (config.Vue) {
            config.Vue.config.errorHandler = (err, vm, info) => {
                console.log(err, vm, info);
            };
        }
    }

    function isSupportPerformanceObserver() {
        return !!window.PerformanceObserver
    }

    function executeAfterLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            const onLoad = () => {
                callback();
                window.removeEventListener('load', onLoad, true);
            };

            window.addEventListener('load', onLoad, true);
        }
    }

    function onBFCacheRestore(callback) {
        window.addEventListener('pageshow', event => {
            if (event.persisted) {
                callback(event);
            }
        }, true);
    }

    function onBeforeunload(callback) {
        window.addEventListener('beforeunload', callback, true);
    }

    function onHidden(callback, once) {
        const onHiddenOrPageHide = (event) => {
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
        executeAfterLoad(() => {
            observeEvent('resource');
            observeEvent('navigation');
        });
    }

    let hasAlreadyCollected = false;
    function observeEvent(entryType) {
        function entryHandler(list) {
            const data = list.getEntries ? list.getEntries() : list;
            for (const entry of data) {
                if (entryType === 'navigation') {
                    if (hasAlreadyCollected) return

                    if (observer) {
                        observer.disconnect();
                    }

                    hasAlreadyCollected = true;
                }
                // nextHopProtocol 属性为空，说明资源解析错误或者跨域
                // beacon 用于上报数据，所以不统计。xhr fetch 单独统计
                if ((!entry.nextHopProtocol && entryType !== 'navigation') || filter(entry.initiatorType)) {
                    return
                }

                lazyReportCache({
                    name: entry.name, // 资源名称
                    subType: entryType,
                    type: 'performance',
                    sourceType: entry.initiatorType, // 资源类型
                    duration: entry.duration, // 资源加载耗时
                    dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 耗时
                    tcp: entry.connectEnd - entry.connectStart, // 建立 tcp 连接耗时
                    redirect: entry.redirectEnd - entry.redirectStart, // 重定向耗时
                    ttfb: entry.responseStart, // 首字节时间
                    protocol: entry.nextHopProtocol, // 请求协议
                    responseBodySize: entry.encodedBodySize, // 响应内容大小
                    responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
                    resourceSize: entry.decodedBodySize, // 资源解压后的大小
                    isCache: isCache(entry), // 是否命中缓存
                });
            }
        }

        let observer;
        if (isSupportPerformanceObserver()) {
            observer = new PerformanceObserver(entryHandler);
            observer.observe({ type: entryType, buffered: true });
        } else {
            const data = window.performance.getEntriesByType(entryType);
            entryHandler(data);
        }
    }

    // 不统计以下类型的资源
    const preventType = ['fetch', 'xmlhttprequest', 'beacon'];
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    if (isSafari) {
        // safari 会把接口请求当成 other
        preventType.push('other');
    }

    function filter(type) {
        return preventType.includes(type)
    }

    function isCache(entry) {
        // 直接从缓存读取或 304
        return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0)
    }

    function observePaint() {
        if (!isSupportPerformanceObserver()) return
        
        const entryHandler = (list) => {        
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    observer.disconnect();
                }
        
                const json = entry.toJSON();
                delete json.duration;
        
                const reportData = {
                    ...json,
                    subType: entry.name,
                    type: 'performance',
                    pageURL: window.location.href,
                };

                lazyReportCache(reportData);
            }
        };
        
        const observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'paint', buffered: true });

        onBFCacheRestore(event => {
            requestAnimationFrame(() => {
                ['first-paint', 'first-contentful-paint'].forEach(type => {
                    lazyReportCache({
                        startTime: performance.now() - event.timeStamp,
                        name: type,
                        subType: type,
                        type: 'performance',
                        pageURL: window.location.href,
                        bfc: true,
                    });
                });
            });
        });
    }

    let lcpDone = false;
    function isLCPDone() {
        return lcpDone
    }

    function observeLCP() {
        if (!isSupportPerformanceObserver()) {
            lcpDone = true;
            return
        }
        
        const entryHandler = (list) => {
            lcpDone = true;

            if (observer) {
                observer.disconnect();
            }
            
            for (const entry of list.getEntries()) {
                const json = entry.toJSON();
                delete json.duration;

                const reportData = {
                    ...json,
                    target: entry.element?.localName,
                    name: entry.entryType,
                    subType: entry.entryType,
                    type: 'performance',
                    pageURL: window.location.href,
                };
                
                lazyReportCache(reportData);
            }
        };

        const observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'largest-contentful-paint', buffered: true });

        onBFCacheRestore(event => {
            requestAnimationFrame(() => {
                lazyReportCache({
                    startTime: performance.now() - event.timeStamp,
                    name: 'largest-contentful-paint',
                    subType: 'largest-contentful-paint',
                    type: 'performance',
                    pageURL: window.location.href,
                    bfc: true,
                });
            });
        });
    }

    function observeCLS() {
        if (!isSupportPerformanceObserver()) return

        onBFCacheRestore(() => {
            observeCLS();
        });

        let sessionValue = 0;
        let sessionEntries = [];
        const cls = {
            subType: 'layout-shift',
            name: 'layout-shift',
            type: 'performance',
            pageURL: window.location.href,
            value: 0,
        };

        const entryHandler = (list) => {
            for (const entry of list.getEntries()) {
                // Only count layout shifts without recent user input.
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                
                    // If the entry occurred less than 1 second after the previous entry and
                    // less than 5 seconds after the first entry in the session, include the
                    // entry in the current session. Otherwise, start a new session.
                    if (
                        sessionValue
                        && entry.startTime - lastSessionEntry.startTime < 1000
                        && entry.startTime - firstSessionEntry.startTime < 5000
                    ) {
                        sessionValue += entry.value;
                        sessionEntries.push(formatCLSEntry(entry));
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [formatCLSEntry(entry)];
                    }
                
                    // If the current session value is larger than the current CLS value,
                    // update CLS and the entries contributing to it.
                    if (sessionValue > cls.value) {
                        cls.value = sessionValue;
                        cls.entries = sessionEntries;
                        lazyReportCache(deepCopy(cls));
                    }
                }
            }
        };

        const observer = new PerformanceObserver(entryHandler);
        observer.observe({ type: 'layout-shift', buffered: true });
    }

    function formatCLSEntry(entry) {
        const result = entry.toJSON();
        delete result.duration;
        delete result.sources;
        
        return result
    }

    function observeFID() {
        onBFCacheRestore(() => {
            observeFID();
        });
        
        if (!isSupportPerformanceObserver()) {
            const entryHandler = (list) => {
                if (observer) {
                    observer.disconnect();
                }
                
                for (const entry of list.getEntries()) {
                    const json = entry.toJSON();
                    json.nodeName = entry.localName;
                    json.event = json.name;
                    json.name = json.entryType;
                    json.type = 'performance';
                    json.pageURL = window.location.href;
                    delete json.cancelable;

                    lazyReportCache(json);
                }
            };
        
            const observer = new PerformanceObserver(entryHandler);
            observer.observe({ type: 'first-input', buffered: true });
            return
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
            const isEpochTime = event.timeStamp > 1e12;
            const now = isEpochTime ? Date.now() : performance.now();
      
            // Input delay is the delta between when the system received the event
            // (e.g. event.timeStamp) and when it could run the callback (e.g. `now`).
            const duration = now - event.timeStamp;

            lazyReportCache({
                duration,
                subType: 'first-input',
                event: event.type,
                name: 'first-input',
                target: event.target.localName,
                startTime: event.timeStamp,
                type: 'performance',
                pageURL: window.location.href,
            });

            eachEventType(window.removeEventListener);
        }
    }

    function eachEventType(callback) {
        const eventTypes = [
            'mousedown',
            'keydown',
            'touchstart',
        ];
        
        eventTypes.forEach((type) => callback(type, onInput, { passive: true, capture: true }));
    }

    function observerLoad() {
        ['load', 'DOMContentLoaded'].forEach(type => onEvent(type));

        onBFCacheRestore(event => {
            requestAnimationFrame(() => {
                ['load', 'DOMContentLoaded'].forEach(type => {
                    lazyReportCache({
                        startTime: performance.now() - event.timeStamp,
                        subType: type,
                        type: 'performance',
                        pageURL: window.location.href,
                        bfc: true,
                    });
                });
            });
        });
    }

    function onEvent(type) {
        function callback() {
            lazyReportCache({
                type: 'performance',
                subType: type,
                startTime: performance.now(),
            });

            window.removeEventListener(type, callback, true);
        }

        window.addEventListener(type, callback, true);
    }

    let isOnLoaded = false;
    executeAfterLoad(() => {
        isOnLoaded = true;
    });

    let timer;
    let observer;
    function checkDOMChange() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            // 等 load、lcp 事件触发后并且 DOM 树不再变化时，计算首屏渲染时间
            if (isOnLoaded && isLCPDone()) {
                observer && observer.disconnect();
                lazyReportCache({
                    type: 'performance',
                    subType: 'first-screen-render-time',
                    startTime: getRenderTime(),
                    pageURL: window.location.href,
                });

                entries = null;
            } else {
                checkDOMChange();
            }
        }, 500);
    }

    let entries = [];
    function observeFirstScreenRenderTime() {
        if (!MutationObserver) return

        const next = window.requestAnimationFrame ? requestAnimationFrame : setTimeout;
        const ignoreDOMList = ['style', 'script', 'link'];

        observer = new MutationObserver(mutationList => {
            checkDOMChange();
            const entry = {
                children: [],
            };

            for (const mutation of mutationList) {
                if (mutation.addedNodes.length && isInScreen(mutation.target)) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && !ignoreDOMList.includes(node.localName) && isInScreen(node)) {
                            entry.children.push(node);
                        }
                    }
                }
            }

            if (entry.children.length) {
                entries.push(entry);
                next(() => {
                    entry.startTime = performance.now();
                });
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true,
        });

        onBFCacheRestore(event => {
            requestAnimationFrame(() => {
                lazyReportCache({
                    startTime: performance.now() - event.timeStamp,
                    type: 'performance',
                    subType: 'first-screen-render-time',
                    bfc: true,
                    pageURL: window.location.href,
                });
            });
        });
    }

    function getRenderTime() {
        let startTime = 0;
        entries.forEach(entry => {
            if (entry.startTime > startTime) {
                startTime = entry.startTime;
            }
        });

        // 需要和当前页面所有加载图片的时间做对比，取最大值
        // 图片请求时间要小于 startTime，响应结束时间要大于 startTime
        performance.getEntriesByType('resource').forEach(item => {
            if (
                item.initiatorType === 'img'
                && item.fetchStart < startTime 
                && item.responseEnd > startTime
            ) {
                startTime = item.responseEnd;
            }
        });
        
        return startTime
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // dom 对象是否在屏幕内
    function isInScreen(dom) {
        const rectInfo = dom.getBoundingClientRect();
        if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight) {
            return true
        }

        return false
    }

    function overwriteOpenAndSend() {
        originalProto.open = function newOpen(...args) {
            this.url = args[1];
            this.method = args[0];
            originalOpen.apply(this, args);
        };

        originalProto.send = function newSend(...args) {
            this.startTime = Date.now();

            const onLoadend = () => {
                this.endTime = Date.now();
                this.duration = this.endTime - this.startTime;

                const { status, duration, startTime, endTime, url, method } = this;
                const reportData = {
                    status,
                    duration,
                    startTime,
                    endTime,
                    url,
                    method: (method || 'GET').toUpperCase(),
                    success: status >= 200 && status < 300,
                    subType: 'xhr',
                    type: 'performance',
                };

                lazyReportCache(reportData);
                
                this.removeEventListener('loadend', onLoadend, true);
            };

            this.addEventListener('loadend', onLoadend, true);
            originalSend.apply(this, args);
        };
    }

    function xhr() {
        overwriteOpenAndSend();
    }

    const originalFetch = window.fetch;

    function overwriteFetch() {
        window.fetch = function newFetch(url, config) {
            const startTime = Date.now();
            const reportData = {
                startTime,
                url,
                method: (config?.method || 'GET').toUpperCase(),
                subType: 'fetch',
                type: 'performance',
            };

            return originalFetch(url, config)
            .then(res => {
                reportData.endTime = Date.now();
                reportData.duration = reportData.endTime - reportData.startTime;

                const data = res.clone();
                reportData.status = data.status;
                reportData.success = data.ok;

                lazyReportCache(reportData);

                return res
            })
            .catch(err => {
                reportData.endTime = Date.now();
                reportData.duration = reportData.endTime - reportData.startTime;
                reportData.status = 0;
                reportData.success = false;

                lazyReportCache(reportData);

                throw err
            })
        };
    }

    function fetch() {
        overwriteFetch();
    }

    const next = window.requestAnimationFrame 
        ? requestAnimationFrame : (callback) => { setTimeout(callback, 1000 / 60); };

    const frames = [];

    function fps() {
        let frame = 0;
        let lastSecond = Date.now();

        function calculateFPS() {
            frame++;
            const now = Date.now();
            if (lastSecond + 1000 <= now) {
                // 由于 now - lastSecond 的单位是毫秒，所以 frame 要 * 1000
                const fps = Math.round((frame * 1000) / (now - lastSecond));
                frames.push(fps);
                    
                frame = 0;
                lastSecond = now;
            }
        
            // 避免上报太快，缓存一定数量再上报
            if (frames.length >= 60) {
                report(deepCopy({
                    frames,
                    type: 'performace',
                    subType: 'fps',
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
        observerLoad();
        observeFirstScreenRenderTime();
        
        if (isSupportSendBeacon()) {
            [onBeforeunload, onHidden].forEach(fn => {
                fn(() => {
                    const data = getCache();
                    if (data.length) {
                        report(data, true);
                        clearCache();
                    }
                });
            });
        }
    }

    const monitor = {
        init(options = {}) {
            setConfig(options);
            error();
            performance$1();
        },
    };

    return monitor;

})();
//# sourceMappingURL=monitor.js.map

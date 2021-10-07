export function isSupportPerformanceObserver() {
    return !!window.PerformanceObserver
}

export function executeAfterLoad(callback) {
    if (document.readyState === 'complete') {
        callback()
    } else {
        window.addEventListener('load', () => {
            callback()
        }, true)
    }
}

export function onBFCacheRestore(callback) {
    window.addEventListener('pageshow', event => {
        if (event.persisted) {
            callback(event)
        }
    }, true)
}

export function onBeforeunload(callback) {
    window.addEventListener('beforeunload', callback, true)
}

export function onHidden(callback, once) {
    const onHiddenOrPageHide = (event) => {
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
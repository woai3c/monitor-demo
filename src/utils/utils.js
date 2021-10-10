export function deepCopy(target) {
    if (typeof target === 'object') {
        const result = Array.isArray(target) ? [] : {}
        for (const key in target) {
            if (typeof target[key] == 'object') {
                result[key] = deepCopy(target[key])
            } else {
                result[key] = target[key]
            }
        }

        return result
    }

    return target
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

export function executeAfterLoad(callback) {
    if (document.readyState === 'complete') {
        callback()
    } else {
        const onLoad = () => {
            callback()
            window.removeEventListener('load', onLoad, true)
        }

        window.addEventListener('load', onLoad, true)
    }
}

export function getPageURL() {
    return window.location.href 
}
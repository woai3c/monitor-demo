export function isSupportPerformanceObserver() {
    return !!window.PerformanceObserver
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
import { isSupportPerformanceObserver } from './utils'
import { onBFCacheRestore, getPageURL } from '../utils/utils'
import { lazyReportCache } from '../utils/report'

export default function observeFID() {
    onBFCacheRestore(() => {
        observeFID()
    })
    
    if (!isSupportPerformanceObserver()) {
        const entryHandler = (list) => {
            if (observer) {
                observer.disconnect()
            }
            
            for (const entry of list.getEntries()) {
                const json = entry.toJSON()
                json.nodeName = entry.tagName
                json.event = json.name
                json.name = json.entryType
                json.type = 'performance'
                json.pageURL = getPageURL()
                delete json.cancelable

                lazyReportCache(json)
            }
        }
    
        const observer = new PerformanceObserver(entryHandler)
        observer.observe({ type: 'first-input', buffered: true })
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
        // In some browsers `event.timeStamp` returns a `DOMTimeStamp` value
        // (epoch time) instead of the newer `DOMHighResTimeStamp`
        // (document-origin time). To check for that we assume any timestamp
        // greater than 1 trillion is a `DOMTimeStamp`, and compare it using
        // the `Date` object rather than `performance.now()`.
        // - https://github.com/GoogleChromeLabs/first-input-delay/issues/4
        const isEpochTime = event.timeStamp > 1e12
        const now = isEpochTime ? Date.now() : performance.now()
  
        // Input delay is the delta between when the system received the event
        // (e.g. event.timeStamp) and when it could run the callback (e.g. `now`).
        const duration = now - event.timeStamp

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
    const eventTypes = [
        'mousedown',
        'keydown',
        'touchstart',
    ]
    
    eventTypes.forEach((type) => callback(type, onInput, { passive: true, capture: true }))
}
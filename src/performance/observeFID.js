import { isSupportPerformanceObserver } from './utils'
import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'

export default function observeFID() {
    if (!isSupportPerformanceObserver()) {
        const entryHandler = (list) => {
            if (observer) {
                observer.disconnect()
            }
            
            for (const entry of list.getEntries()) {
                const json = entry.toJSON()
                json.nodeName = entry.localName
                json.event = json.name
                json.name = json.entryType
                json.type = 'performance'
                delete json.cancelable

                addCache(json)
                lazyReportCache()
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

        addCache({
            duration,
            entryType: 'first-input',
            event: event.type,
            name: 'first-input',
            target: event.target.localName,
            startTime: event.timeStamp,
            type: 'performance',

        })

        lazyReportCache()
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
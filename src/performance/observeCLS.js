import { isSupportPerformanceObserver } from './utils'
import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'
import { deepCopy } from '../utils/utils'

export default function observeCLS() {
    if (!isSupportPerformanceObserver()) return

    let sessionValue = 0
    let sessionEntries = []
    const cls = {
        subType: 'layout-shift',
        name: 'layout-shift',
        type: 'performance',
        value: 0,
    }

    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            // Only count layout shifts without recent user input.
            if (!entry.hadRecentInput) {
                const firstSessionEntry = sessionEntries[0]
                const lastSessionEntry = sessionEntries[sessionEntries.length - 1]
            
                // If the entry occurred less than 1 second after the previous entry and
                // less than 5 seconds after the first entry in the session, include the
                // entry in the current session. Otherwise, start a new session.
                if (
                    sessionValue
                    && entry.startTime - lastSessionEntry.startTime < 1000
                    && entry.startTime - firstSessionEntry.startTime < 5000
                ) {
                    sessionValue += entry.value
                    sessionEntries.push(formatCLSEntry(entry))
                } else {
                    sessionValue = entry.value
                    sessionEntries = [formatCLSEntry(entry)]
                }
            
                // If the current session value is larger than the current CLS value,
                // update CLS and the entries contributing to it.
                if (sessionValue > cls.value) {
                    cls.value = sessionValue
                    cls.entries = sessionEntries
                    addCache(deepCopy(cls))
                    lazyReportCache()
                }
            }
        }
    }

    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'layout-shift', buffered: true })
}

function formatCLSEntry(entry) {
    const result = entry.toJSON()
    delete result.duration
    delete result.sources
    
    return result
}
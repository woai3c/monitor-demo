import { isSupportPerformanceObserver } from './utils'
import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'

export default function observeLCP() {
    if (!isSupportPerformanceObserver()) return

    const entryHandler = (list) => {
        if (observer) {
            observer.disconnect()
        }
        
        for (const entry of list.getEntries()) {
            const json = entry.toJSON()
            delete json.duration

            const reportData = {
                ...json,
                target: entry.element.localName,
                name: entry.entryType,
                type: 'performance',
            }
            
            addCache(reportData)
            lazyReportCache()
        }
    }

    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
}
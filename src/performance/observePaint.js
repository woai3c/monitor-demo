import { isSupportPerformanceObserver, onBFCacheRestore } from './utils'
import { lazyReportCache } from '../utils/report'

export default function observePaint() {
    if (!isSupportPerformanceObserver()) return
    
    const entryHandler = (list) => {        
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                observer.disconnect()
            }
    
            const json = entry.toJSON()
            delete json.duration
    
            const reportData = {
                ...json,
                subType: entry.name,
                type: 'performance',
                pageURL: window.location.href,
            }

            lazyReportCache(reportData)
        }
    }
    
    const observer = new PerformanceObserver(entryHandler)
    observer.observe({ type: 'paint', buffered: true })

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
                })
            })
        })
    })
}
import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'
import { onBFCacheRestore } from './utils'

export default function observerLoad() {
    ['load', 'DOMContentLoaded'].forEach(type => onEvent(type))

    onBFCacheRestore(event => {
        requestAnimationFrame(() => {
            ['load', 'DOMContentLoaded'].forEach(type => {
                addCache(
                    {
                        startTime: performance.now() - event.timeStamp,
                        subType: type,
                        type: 'performance',
                        pageURL: window.location.href,
                        bfc: true,
                    },
                )
            })
            
            lazyReportCache()
        })
    })
}

function onEvent(type) {
    function callback() {
        addCache({
            type: 'performance',
            subType: type,
            startTime: performance.now(),
        })

        lazyReportCache()
        window.removeEventListener(type, callback, true)
    }

    window.addEventListener(type, callback, true)
}
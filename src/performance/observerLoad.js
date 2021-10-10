import { lazyReportCache } from '../utils/report'
import { onBFCacheRestore, getPageURL } from '../utils/utils'

export default function observerLoad() {
    ['load', 'DOMContentLoaded'].forEach(type => onEvent(type))

    onBFCacheRestore(event => {
        requestAnimationFrame(() => {
            ['load', 'DOMContentLoaded'].forEach(type => {
                lazyReportCache({
                    startTime: performance.now() - event.timeStamp,
                    subType: type,
                    type: 'performance',
                    pageURL: getPageURL(),
                    bfc: true,
                })
            })
        })
    })
}

function onEvent(type) {
    function callback() {
        lazyReportCache({
            type: 'performance',
            subType: type,
            startTime: performance.now(),
        })

        window.removeEventListener(type, callback, true)
    }

    window.addEventListener(type, callback, true)
}
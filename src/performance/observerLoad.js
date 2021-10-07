import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'

export default function observerLoad() {
    // eslint-disable-next-line no-extra-semi
    ;['load', 'DOMContentLoaded'].forEach(type => onEvent(type))
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
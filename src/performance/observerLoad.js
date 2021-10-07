import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'
import { observeEvent } from './observeEntries'

export default function observerLoad() {
    // eslint-disable-next-line no-extra-semi
    ;['load', 'DOMContentLoaded'].forEach(type => onEvent(type))
}

function onEvent(type) {
    // 等页面 load 完毕再统计 navigation 信息
    if (type === 'load') {
        setTimeout(() => {
            observeEvent('navigation')
        }, 1000)
    }

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
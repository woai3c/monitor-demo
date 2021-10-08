import { executeAfterLoad } from './utils'
import { isLCPDone } from './observeLCP'
import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'

let isOnLoaded = false
executeAfterLoad(() => {
    isOnLoaded = true
})

let timer
let observer
let startTime = 0
function checkDOMChange() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        // 等 load、lcp 事件触发后并且 DOM 树不再变化时，计算首屏渲染时间
        if (isOnLoaded && isLCPDone()) {
            observer && observer.disconnect()
            addCache({
                type: 'performance',
                subType: 'first-screen-render-time',
                startTime: getRenderTime(),
                pageURL: window.location.href,
            })

            lazyReportCache()
        } else {
            checkDOMChange()
        }
    }, 500)
}

export default function observeFirstScreenRenderTime() {
    if (!MutationObserver) return
    
    observer = new MutationObserver(() => {
        checkDOMChange()
        startTime = performance.now()
    })

    observer.observe(document, {
        childList: true,
        subtree: true,
    })
}

function getRenderTime() {
    const resource = performance.getEntriesByType('resource').filter(item => item.initiatorType === 'img')
    resource.forEach(item => {
        if (item.responseEnd > startTime) {
            startTime = item.responseEnd
        }
    })

    return startTime
}
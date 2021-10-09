import { executeAfterLoad, onBFCacheRestore } from './utils'
import { isLCPDone } from './observeLCP'
import { lazyReportCache } from '../utils/report'

let isOnLoaded = false
executeAfterLoad(() => {
    isOnLoaded = true
})

let timer
let observer
function checkDOMChange() {
    clearTimeout(timer)
    timer = setTimeout(() => {
        // 等 load、lcp 事件触发后并且 DOM 树不再变化时，计算首屏渲染时间
        if (isOnLoaded && isLCPDone()) {
            observer && observer.disconnect()
            lazyReportCache({
                type: 'performance',
                subType: 'first-screen-render-time',
                startTime: getRenderTime(),
                pageURL: window.location.href,
            })

            entries = null
        } else {
            checkDOMChange()
        }
    }, 500)
}

let entries = []
export default function observeFirstScreenRenderTime() {
    if (!MutationObserver) return

    const next = window.requestAnimationFrame ? requestAnimationFrame : setTimeout
    const ignoreDOMList = ['style', 'script', 'link']

    observer = new MutationObserver(mutationList => {
        checkDOMChange()
        const entry = {
            children: [],
        }

        for (const mutation of mutationList) {
            if (mutation.addedNodes.length && isInScreen(mutation.target)) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && !ignoreDOMList.includes(node.localName) && isInScreen(node)) {
                        entry.children.push(node)
                    }
                }
            }
        }

        if (entry.children.length) {
            entries.push(entry)
            next(() => {
                entry.startTime = performance.now()
            })
        }
    })

    observer.observe(document, {
        childList: true,
        subtree: true,
    })

    onBFCacheRestore(event => {
        requestAnimationFrame(() => {
            lazyReportCache({
                startTime: performance.now() - event.timeStamp,
                type: 'performance',
                subType: 'first-screen-render-time',
                bfc: true,
                pageURL: window.location.href,
            })
        })
    })
}

function getRenderTime() {
    let startTime = 0
    entries.forEach(entry => {
        if (entry.startTime > startTime) {
            startTime = entry.startTime
        }
    })

    // 需要和当前页面所有加载图片的时间做对比，取最大值
    // 图片请求时间要小于 startTime，响应结束时间要大于 startTime
    performance.getEntriesByType('resource').forEach(item => {
        if (
            item.initiatorType === 'img'
            && item.fetchStart < startTime 
            && item.responseEnd > startTime
        ) {
            startTime = item.responseEnd
        }
    })
    
    return startTime
}

const viewportWidth = window.innerWidth
const viewportHeight = window.innerHeight

// dom 对象是否在屏幕内
function isInScreen(dom) {
    const rectInfo = dom.getBoundingClientRect()
    if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight) {
        return true
    }

    return false
}
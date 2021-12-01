import { executeAfterLoad, onBFCacheRestore, getPageURL } from '../utils/utils'
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
                subType: 'first-screen-paint',
                startTime: getRenderTime(),
                pageURL: getPageURL(),
            })

            entries = null
        } else {
            checkDOMChange()
        }
    }, 500)
}

let entries = []
export default function observeFirstScreenPaint() {
    if (!MutationObserver) return

    const next = window.requestAnimationFrame ? requestAnimationFrame : setTimeout
    const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK', 'META']
    observer = new MutationObserver(mutationList => {
        checkDOMChange()
        const entry = {
            startTime: 0,
            children: [],
        }
        
        next(() => {
            entry.startTime = performance.now()
        })

        for (const mutation of mutationList) {
            if (mutation.addedNodes.length) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (
                        node.nodeType === 1 
                        && !ignoreDOMList.includes(node.tagName)
                        && !isInclude(node, entry.children)
                    ) {
                        entry.children.push(node)
                    }
                }
            }
        }

        if (entry.children.length) {
            entries.push(entry)
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
                subType: 'first-screen-paint',
                bfc: true,
                pageURL: getPageURL(),
            })
        })
    })
}

function getRenderTime() {
    let startTime = 0
    entries.forEach(entry => {
        for (const node of entry.children) {
            if (isInScreen(node) && entry.startTime > startTime && needToCalculate(node)) {
                startTime = entry.startTime
                break
            }
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

function needToCalculate(node) {
    // 隐藏的元素不用计算
    if (window.getComputedStyle(node).display === 'none') return false
    
    // 用于统计的图片不用计算
    if (node.tagName === 'IMG' && node.width < 2 && node.height < 2) {
        return false
    }
    
    return true
}

function isInclude(node, arr) {
    if (!node || node === document.documentElement) {
        return false
    }
    
    if (arr.includes(node)) {
        return true
    }

    return isInclude(node.parentElement, arr)
}

const viewportWidth = window.innerWidth
const viewportHeight = window.innerHeight

// dom 对象是否在屏幕内
function isInScreen(dom) {
    const rectInfo = dom.getBoundingClientRect()
    if (
        rectInfo.left >= 0 
        && rectInfo.left < viewportWidth
        && rectInfo.top >= 0
        && rectInfo.top < viewportHeight
    ) {
        return true
    }
}
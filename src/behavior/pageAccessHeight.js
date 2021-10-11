import { lazyReportCache, report } from '../utils/report'
import { getUUID } from './utils'
import { onBeforeunload, executeAfterLoad, getPageURL } from '../utils/utils'

let timer
let startTime = 0
let hasReport = false
let pageHeight = 0
let scrollTop = 0
let viewportHeight = 0

export default function pageAccessHeight() {
    window.addEventListener('scroll', onScroll)

    onBeforeunload(() => {
        const now = performance.now()
        report({
            startTime: now,
            duration: now - startTime,
            type: 'behavior',
            subType: 'page-access-height',
            pageURL: getPageURL(),
            value: toPercent((scrollTop + viewportHeight) / pageHeight),
            uuid: getUUID(),
        }, true)
    })

    // 页面加载完成后初始化记录当前访问高度、时间
    executeAfterLoad(() => {
        startTime = performance.now()
        pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        viewportHeight = window.innerHeight
    })
}

function onScroll() {
    clearTimeout(timer)
    const now = performance.now()
    
    if (!hasReport) {
        hasReport = true
        lazyReportCache({
            startTime: now,
            duration: now - startTime,
            type: 'behavior',
            subType: 'page-access-height',
            pageURL: getPageURL(),
            value: toPercent((scrollTop + viewportHeight) / pageHeight),
            uuid: getUUID(),
        })
    }

    timer = setTimeout(() => {
        hasReport = false
        startTime = now
        pageHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        viewportHeight = window.innerHeight        
    }, 500)
}

function toPercent(val) {
    if (val >= 1) return '100%'
    return (val * 100).toFixed(2) + '%'
}
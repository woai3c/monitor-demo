import { isSupportPerformanceObserver } from './utils'
import { executeAfterLoad } from '../utils/utils'
import { lazyReportCache } from '../utils/report'

export default function observeEntries() {
    executeAfterLoad(() => {
        observeEvent('resource')
        observeEvent('navigation')
    })
}

let hasAlreadyCollected = false
export function observeEvent(entryType) {
    function entryHandler(list) {
        const data = list.getEntries ? list.getEntries() : list
        for (const entry of data) {
            if (entryType === 'navigation') {
                if (hasAlreadyCollected) return

                if (observer) {
                    observer.disconnect()
                }

                hasAlreadyCollected = true
            }
            // nextHopProtocol 属性为空，说明资源解析错误或者跨域
            // beacon 用于上报数据，所以不统计。xhr fetch 单独统计
            if ((!entry.nextHopProtocol && entryType !== 'navigation') || filter(entry.initiatorType)) {
                return
            }

            lazyReportCache({
                name: entry.name, // 资源名称
                subType: entryType,
                type: 'performance',
                sourceType: entry.initiatorType, // 资源类型
                duration: entry.duration, // 资源加载耗时
                dns: entry.domainLookupEnd - entry.domainLookupStart, // DNS 耗时
                tcp: entry.connectEnd - entry.connectStart, // 建立 tcp 连接耗时
                redirect: entry.redirectEnd - entry.redirectStart, // 重定向耗时
                ttfb: entry.responseStart, // 首字节时间
                protocol: entry.nextHopProtocol, // 请求协议
                responseBodySize: entry.encodedBodySize, // 响应内容大小
                responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
                resourceSize: entry.decodedBodySize, // 资源解压后的大小
                isCache: isCache(entry), // 是否命中缓存
                startTime: performance.now(),
            })
        }
    }

    let observer
    if (isSupportPerformanceObserver()) {
        observer = new PerformanceObserver(entryHandler)
        observer.observe({ type: entryType, buffered: true })
    } else {
        const data = window.performance.getEntriesByType(entryType)
        entryHandler(data)
    }
}

// 不统计以下类型的资源
const preventType = ['fetch', 'xmlhttprequest', 'beacon']
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
if (isSafari) {
    // safari 会把接口请求当成 other
    preventType.push('other')
}

function filter(type) {
    return preventType.includes(type)
}

function isCache(entry) {
    // 直接从缓存读取或 304
    return entry.transferSize === 0 || (entry.transferSize !== 0 && entry.encodedBodySize === 0)
}
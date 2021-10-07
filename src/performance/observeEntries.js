import { isSupportPerformanceObserver, executeAfterLoad } from './utils'
import { lazyReportCache } from '../utils/report'
import { addCache } from '../utils/cache'

export default function observeEntries() {
    observeEvent('resource')
    observeEvent('navigation')
}

export function observeEvent(entryType) {
    function entryHandler(list) {
        const data = list.getEntries? list.getEntries() : list
        for (const entry of data) {
            if (entryType === 'navigation' && observer) {
                observer.disconnect()
            }
            // 这两个参数为 0，说明资源解析错误或者跨域
            // beacon 用于上报数据，所以不统计
            if (
                (entry.domainLookupStart && entry.connectStart === 0)
                || filter(entry.initiatorType)
            ) {
                return
            }

            addCache({
                name: entry.name, // 资源名称
                type: entryType,
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
                isCache: entry.transferSize === 0, // 是否命中缓存
            })
        }
    
        lazyReportCache()
    }

    let observer
    if (isSupportPerformanceObserver()) {
        observer = new PerformanceObserver(entryHandler)
        observer.observe({ type: entryType, buffered: true })
    } else {
        executeAfterLoad(() => {
            const data = window.performance.getEntriesByType(entryType)
            entryHandler(data)
            
            setTimeout(() => {
                if (entryType === 'resource') {
                    // 收集数据后，清除资源的性能统计缓存
                    window.performance.clearResourceTimings()
                }
            })
        })
    }
}

// 不统计以下类型的资源
const preventType = ['fetch', 'xmlhttprequest', 'beacon']
function filter(type) {
    return preventType.includes(type)
}
import { report } from '../utils/report'
import config from '../config'

export default function error() {
    // 捕获资源加载失败错误 js css img...
    window.addEventListener('error', e => {
        const target = e.target
        if (!target) return

        if (target.src || target.href) {
            const url = target.src || target.href
            report({
                url,
                type: 'error',
                subType: 'resource',
                startTime: e.timeStamp,
                html: target.outerHTML,
                resourceType: target.localName,
                paths: e.path.map(item => item.localName).filter(Boolean),
                pageURL: window.location.href,
            })
        }
    }, true)

    // 监听 js 错误
    window.onerror = (msg, url, line, column, error) => {
        report({
            msg,
            line,
            column,
            error: error.stack,
            subType: 'js',
            pageURL: url,
            type: 'error',
            startTime: performance.now(),
        })
    }

    // 监听 promise 错误 缺点是获取不到列数据
    window.addEventListener('unhandledrejection', e => {
        report({
            reason: e.reason?.stack,
            subType: 'promise',
            type: 'error',
            startTime: e.timeStamp,
        })
    })

    if (config.Vue) {
        config.Vue.config.errorHandler = (err, vm, info) => {
            console.log(err, vm, info)
        }
    }
}
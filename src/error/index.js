import { report } from '../utils/report'

export default function error() {
    // 捕获资源加载失败错误 js css img...
    window.addEventListener('error', e => {
        const target = e.target
        if (!target) return

        let url = ''
        if (target.src || target.href) {
            url = target.src || target.href
            console.log(url)
        }
    }, true)

    // 监听 js 错误
    window.onerror = (msg, url, row, col, error) => {
        console.log(msg, url, row, col, error)
        console.log(error)
    }

    // 监听 promise 错误 缺点是获取不到列数据
    window.addEventListener('unhandledrejection', e => {
        console.log(e.reason)
    })
}
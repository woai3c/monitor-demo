import { lazyReportCache } from '../utils/report'
import { getPageURL } from '../utils/utils'

export default function onVueRouter(Vue, router) {
    let isFirst = true
    let startTime
    router.beforeEach((to, from, next) => {
        // 首次进入页面已经有其他统计的渲染时间可用
        if (isFirst) {
            isFirst = false
            return next()
        }

        // 给 router 新增一个字段，表示是否要计算渲染时间
        // 只有路由跳转才需要计算
        router.needCalculateRenderTime = true
        startTime = performance.now()

        next()
    })

    let timer
    Vue.mixin({
        mounted() {
            if (!router.needCalculateRenderTime) return

            this.$nextTick(() => {
                // 仅在整个视图都被渲染之后才会运行的代码
                const now = performance.now()
                clearTimeout(timer)

                timer = setTimeout(() => {
                    router.needCalculateRenderTime = false
                    lazyReportCache({
                        type: 'performance',
                        subType: 'vue-router-change-paint',
                        duration: now - startTime,
                        startTime: now,
                        pageURL: getPageURL(),
                    })
                }, 1000)
            })
        },
    })
}
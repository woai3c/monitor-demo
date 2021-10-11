import { getPageURL } from '../utils/utils'
import { lazyReportCache } from '../utils/report'
import { getUUID } from './utils'

export default function pageChange() {
    let from = ''
    window.addEventListener('popstate', () => {
        const to = getPageURL()

        lazyReportCache({
            from,
            to,
            type: 'behavior',
            subType: 'popstate',
            startTime: performance.now(),
            uuid: getUUID(),
        })

        from = to
    }, true)

    let oldURL = ''
    window.addEventListener('hashchange', event => {
        const newURL = event.newURL

        lazyReportCache({
            from: oldURL,
            to: newURL,
            type: 'behavior',
            subType: 'hashchange',
            startTime: performance.now(),
            uuid: getUUID(),
        })

        oldURL = newURL
    }, true)
}
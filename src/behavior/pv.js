import { lazyReportCache } from '../utils/report'
import { getUUID } from './utils'

export default function pv() {
    lazyReportCache({
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageURL: window.location.href,
        referrer: document.referrer,
        uuid: getUUID(),
    })
}
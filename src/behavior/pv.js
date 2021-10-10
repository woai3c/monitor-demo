import { lazyReportCache } from '../utils/report'
import { getUUID } from './utils'
import { getPageURL } from '../utils/utils'

export default function pv() {
    lazyReportCache({
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageURL: getPageURL(),
        referrer: document.referrer,
        uuid: getUUID(),
    })
}
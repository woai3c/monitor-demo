import { report } from '../utils/report'
import { onBeforeunload } from '../utils/utils'
import { getUUID } from './utils'

export default function pageAccessDuration() {
    onBeforeunload(() => {
        report({
            type: 'behavior',
            subType: 'pageAccessDuration',
            startTime: performance.now(),
            pageURL: window.location.href,
            uuid: getUUID(),
        }, true)
    })
}
import { addCache } from '../utils/cache'
import { lazyReportCache } from '../utils/report'

const originalFetch = window.fetch

function overwriteFetch() {
    window.fetch = function newFetch(url, config) {
        const startTime = Date.now()
        const reportData = {
            startTime,
            url,
            method: config?.method || 'GET',
            subType: 'fetch',
            type: 'performance',
        }

        return originalFetch(url, config)
        .then(res => {
            reportData.endTime = Date.now()
            reportData.duration = reportData.endTime - reportData.startTime

            const data = res.clone()
            reportData.status = data.status
            reportData.success = data.ok

            addCache(reportData)
            lazyReportCache()

            return res
        })
        .catch(err => {
            reportData.endTime = Date.now()
            reportData.duration = reportData.endTime - reportData.startTime
            reportData.status = 0
            reportData.success = false

            addCache(reportData)
            lazyReportCache()

            throw err
        })
    }
}

export default function fetch() {
    overwriteFetch()
}
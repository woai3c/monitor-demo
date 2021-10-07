import { originalOpen, originalSend } from './xhr'
import { getCache, clearCache } from './cache'
import { sessionID } from '../utils/generateUniqueID'
import config from '../config'

export function isSupportSendBeacon() {
    return !!window.navigator?.sendBeacon
}

const sendBeacon = isSupportSendBeacon()? window.navigator.sendBeacon.bind(window.navigator) : reportWithXHR

export function report(data, isImmediate = false) {
    if (!config.url) {
        console.error('请设置上传 url 地址')
    }

    const reportData = JSON.stringify({
        id: sessionID,
        appID: config.appID,
        userID: config.userID,
        data,
    })

    if (isImmediate) {
        sendBeacon(config.url, reportData)
        return
    }

    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            sendBeacon(config.url, reportData)
        }, { timeout: 3000 })
    } else {
        setTimeout(() => {
            sendBeacon(config.url, reportData)
        })
    }
}

let timer = null
export function lazyReportCache(timeout = 3000) {
    clearTimeout(timer)
    timer = setTimeout(() => {
        const data = getCache()
        if (data.length) {
            report(data)
            clearCache()
        }
    }, timeout)
}

export function reportWithXHR(data) {
    const xhr = new XMLHttpRequest()
    originalOpen.call(xhr, 'post', config.url)
    originalSend.call(xhr, JSON.stringify(data))
}
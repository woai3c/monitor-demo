import observeEntries from './observeEntries'
import observePaint from './observePaint'
import observeLCP from './observeLCP'
import observeCLS from './observeCLS'
import observeFID from './observeFID'
import observerLoad from './observerLoad'
import observeFirstScreenRenderTime from './observeFirstScreenRenderTime'
import xhr from './xhr'
import fetch from './fetch'
import fps from './fps'
import { onBeforeunload, onHidden } from './utils'
import { isSupportSendBeacon, report } from '../utils/report'
import { getCache, clearCache } from '../utils/cache'

export default function performance() {
    observeEntries()
    observePaint()
    observeLCP()
    observeCLS()
    observeFID()
    xhr()
    fetch()
    fps()
    observerLoad()
    observeFirstScreenRenderTime()
    
    if (isSupportSendBeacon()) {
        // eslint-disable-next-line no-extra-semi
        ;[onBeforeunload, onHidden].forEach(fn => {
            fn(() => {
                const data = getCache()
                if (data.length) {
                    report(data, true)
                    clearCache()
                }
            })
        })
    }
}
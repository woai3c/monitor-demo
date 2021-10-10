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
}
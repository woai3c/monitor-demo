import error from './error/index'
import performance from './performance/index'
import { setConfig } from './config'

const monitor = {
    init(options = {}) {
        setConfig(options)
        error()
        performance()
    },
}

export default monitor
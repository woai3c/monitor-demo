import pv from './pv'
import pageAccessDuration from './pageAccessDuration'
import pageAccessHeight from './pageAccessHeight'
import onClick from './onClick'
import config from '../config'
import onVueRouter from './onVueRouter'
import pageChange from './pageChange'

export default function behavior() {
    pv()
    pageAccessDuration()
    pageAccessHeight()
    onClick()
    pageChange()

    if (config.vue?.router) {
        onVueRouter(config.vue.router)
    }
}
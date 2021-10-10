import generateUniqueID from '../utils/generateUniqueID'

let uuid = ''
export function getUUID() {
    if (uuid) return uuid

    // 如果是手机 APP，可以调用原生方法或者设备唯一标识当成 uuid
    uuid = localStorage.getItem('uuid')
    if (uuid) return uuid

    uuid = generateUniqueID()
    localStorage.setItem('uuid', uuid)
    return uuid
}
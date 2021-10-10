const config = {
    url: '',
    appID: '',
    userID: '',
    vue: {
        Vue: null,
        router: null,
    },
}

export default config

export function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key]
        }
    }
}
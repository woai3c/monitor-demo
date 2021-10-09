const config = {
    url: '',
    appID: '',
    userID: '',
    Vue: null,
}

export default config

export function setConfig(options) {
    for (const key in config) {
        if (options[key]) {
            config[key] = options[key]
        }
    }
}
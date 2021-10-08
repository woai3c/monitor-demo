const path = require('path')
const json = require('@rollup/plugin-json')

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const plugins = [
    json({
        compact: true,
    }),
]

module.exports = [
    {
        plugins,
        input: resolveFile('../src/index.js'),
        output: {
            file: resolveFile('../dist/monitor.js'),
            format: 'iife',
            name: 'monitor',
        },
    },
]

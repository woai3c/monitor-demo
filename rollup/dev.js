const path = require('path')
const json = require('@rollup/plugin-json')
const rollup = require('rollup')

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const plugins = [
    json({
        compact: true,
    }),
]

const watchOptions = {
    plugins,
    input: resolveFile('../src/index.js'),
    output: {
        file: resolveFile('../dist/monitor.js'),
        format: 'iife',
        name: 'monitor',
    },
}

rollup.watch(watchOptions)

console.log('rollup watching...')
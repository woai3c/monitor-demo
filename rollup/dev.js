const path = require('path')
const json = require('@rollup/plugin-json')
const { babel } = require('@rollup/plugin-babel')
const rollup = require('rollup')

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const plugins = [
    json({
        compact: true,
    }),
    babel({
        extensions: ['.js', '.ts'],
        babelHelpers: 'bundled',
        presets: [[
            '@babel/env',
            {
                targets: {
                    browsers: [
                        '> 1%',
                        'last 2 versions',
                        'not ie <= 8',
                    ],
                },
            },
        ]],
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
const path = require('path')
const typescript = require('@rollup/plugin-typescript')
const json = require('@rollup/plugin-json')
const { babel } = require('@rollup/plugin-babel')

const resolveFile = function (filePath) {
    return path.join(__dirname, filePath)
}

const plugins = [
    typescript(),
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

module.exports = [
    {
        plugins,
        input: resolveFile('src/index.ts'),
        output: {
            file: resolveFile('dist/monitor.js'),
            format: 'esm',
            name: 'monitor',
        },
        
    },
]

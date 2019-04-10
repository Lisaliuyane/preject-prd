const { injectBabelPlugin } = require('react-app-rewired')
const path = require('path')
const rewireLess = require('react-app-rewire-less')
const rewireMobX = require('react-app-rewire-mobx')
const Theme = require('./theme')
const rewireStylelint = require('react-app-rewire-stylelint')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config)
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config)
    config = rewireMobX(config, env)
    config = rewireStylelint(config, env)
    config = rewireLess.withLoaderOptions({
        modifyVars: Theme,
        javascriptEnabled: true
    })(config, env)
    config.resolve.alias = Object.assign(
        config.resolve.alias, {
            '@src': resolve('./src')
        }
    )
    // config.module.rules.push({
    //     test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    //     issuer: {
    //         test: /\.jsx?$/
    //     },
    //     use: [
    //         {
    //             loader: 'babel-loader',
    //         },
    //         {
    //             loader: '@svgr/webpack',
    //             options: {
    //                 babel: false,
    //                 icon: true
    //             },
    //         }
    //     ]
    // })
    // console.log('config-overrides', config)
    return config
}
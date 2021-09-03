// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const { name } = require('./package')

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const devServerPort = 9531 // TODO: get this variable from setting.ts
const mockServerPort = 9531 // TODO: get this variable from setting.ts
const title = '智慧医院云HIS' // TODO: get this variable from setting.ts

// 添加时间戳
const TimeServestamp = new Date().getTime()
module.exports = {
  //publicPath: '/op',
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  // 解决打包缓存问题
  configureWebpack: {
    output: {
      filename: `js/[name].${TimeServestamp}.js`,
      chunkFilename: `js/[name].${TimeServestamp}.js`,
    },
  },
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    progress: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    proxy: {
      '/op-service': {
        // target: 'http://192.168.55.211:81/op-service',
        // target: 'http://192.168.1.161:8502', // bjh本地
        target: 'http://192.168.30.150:8085',
        // target: 'http://192.168.31.117:8080', // zgy
        // target: 'http://172.22.138.81:8501/op-service', // bjh-医保
        // target: 'http://192.168.169.58:8501/op-service',
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/op-service': '',
        },
      },
      '/ybapi-service': {
        // target: 'http://192.168.55.211:81/ybapi-service',
        target: 'http://220.196.249.90:86/ybapi-service',
        // target: 'http://172.22.138.81:8461/ybapi-service', // bjh-医保
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/ybapi-service': '',
        },
      },
      '/im-service': {
        // target: 'http://192.168.55.211:81/im-service',
        target: 'http://220.196.249.90:86/im-service',
        // target: 'http://172.22.138.81:8491/im-service', // bjh-医保
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/im-service': '',
        },
      },
      '/mms-service': {
        // target: 'http://192.168.55.211:81/mms-service',
        target: 'http://220.196.249.90:86/mms-service',
        // target: 'http://172.22.181.202:8441/mms-service', // 信息科内网
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/mms-service': '',
        },
      },
      '/mtdms-service': {
        // target: 'http://192.168.55.211:81/mtdms-service',
        target: 'http://220.196.249.90:86/mtdms-service',
        // target: 'http://192.168.31.166:8080',
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/mtdms-service': '',
        },
      },
      '/drug-service': {
        // target: 'http://192.168.55.211:81/drug-service',
        target: 'http://220.196.249.90:86/drug-service',
        // target: 'http://172.22.181.202:8511/drug-service', // 信息科内网
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/drug-service': '',
        },
      },
      '/system-service': {
        // target: 'http://192.168.55.211:81/system-service',
        target: 'http://220.196.249.90:86/system-service',
        // target: 'http://172.22.181.202:8561', // 信息科内网
        // target: 'http://192.168.169.58:8561',
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/system-service': '',
        },
      },
      '/apply-service': {
        // target: 'http://192.168.55.211:81/apply-service',
        target: 'http://220.196.249.90:86/apply-service',
        // target: 'http://192.168.10.45:8586', // zz
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/apply-service': '',
        },
      },
      '/dic': {
        // target: 'http://192.168.55.211:81/dic',
        target: 'http://220.196.249.90:86/dic',
        // target: 'http://172.22.181.202:8571', // 信息科内网
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/dic': '',
        },
      },
      '/design': {
        // target: 'http://192.168.55.211:81/design',
        target: 'http://220.196.249.90:86/design',
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          '^/design': '',
        },
      },
    },
  },
  // 自定义webpack配置
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  pwa: {
    name: title,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js'),
    },
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/styles/_variables.scss'), path.resolve(__dirname, 'src/styles/_mixins.scss')],
    },
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', title)

    // https://webpack.js.org/configuration/devtool/#development
    config.when(process.env.NODE_ENV === 'development', (config) => config.devtool('cheap-eval-source-map'))

    // remove vue-cli-service's progress output
    config.plugins.delete('progress')
    // replace with another progress output plugin to solve the this bug:
    // https://github.com/vuejs/vue-cli/issues/4557
    config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
      {
        format: 'compact',
      },
    ])

    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: path.resolve(__dirname, 'src/components'),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      config.optimization.runtimeChunk('single')
    })
  },
}

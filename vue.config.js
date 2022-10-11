let CompressionWebpackPlugin = require("compression-webpack-plugin");
const vConsolePlugin = require("vconsole-webpack-plugin");
module.exports = {
  // 选项...
  /* 部署应用包的基本URL */
  publicPath: "./",

  /* 当运行 vue-cli-service build 时生成的生产环境构建文件的目录 defalut: dist */
  outputDir: "./dist",

  /* 放置生成的静态文件目录（js css img） */
  assetsDir: "static",

  /* 指定生成的index.html 输出路径 相对 default: index.html */
  indexPath: "index.html",

  /* 指定生成文件名中包含hash default: true */
  filenameHashing: false,

  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  // 所有 webpack-dev-server 的选项都支持。
  devServer: {
    host: "0.0.0.0",
    port: 8888, // 端口号
    https: false,
    open: false, //配置自动启动浏览器

    // 配置多个代理
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_URL, // 代理服务器路径
        changeOrigin: true,
        pathRewrite: {
          "^/api": "", // 去掉接口地址中的api字符串
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/styles/index.scss";`,
      },
    },
  },
  configureWebpack: (config) => {
    // 生产环境去掉vconsole调试器
    let envType = process.env.NODE_ENV != "production";
    let pluginsDev = [
      new vConsolePlugin({
        filter: [],
        enable: envType,
      }),
    ];
    config.plugins = [...config.plugins, ...pluginsDev];
    if (process.env.NODE_ENV !== "production") return;
    config.plugins.push(
      new CompressionWebpackPlugin({
        // 正在匹配需要压缩的文件后缀
        test: /\.(js|css|svg|woff|ttf|json|html)$/,
        // 大于10kb的会压缩
        threshold: 10240,
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false, // 删除原文件
        // 其余配置查看compression-webpack-plugin
      })
    );
  },
};

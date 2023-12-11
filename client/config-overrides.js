const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class AssetManifestPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('AssetManifestPlugin', (compilation, callback) => {
      let manifest = {};
      // 遍历所有编译过的资源文件
      for (let filename in compilation.assets) {
        if (filename.match(/\.css$/)) {
          // 假设你的CSS文件名格式为 'main.[hash].css'
          manifest['main.css'] = filename;
        }
      }
      // 将manifest对象转换为字符串
      let manifestJson = JSON.stringify(manifest);
      // 把它添加到输出中
      compilation.assets['asset-manifest.json'] = {
        source: () => manifestJson,
        size: () => manifestJson.length,
      };
      callback();
    });
  }
}

module.exports = function override(config, env) {
  config.plugins.push(new AssetManifestPlugin());
  config.entry = {
    main: path.join(__dirname, 'src', 'index.js'),
    contentScript: path.join(__dirname, 'src', 'content', 'contentScript.js'),
    background: path.join(__dirname, 'src', 'background', 'background.js'),
  };
  config.output.filename = 'static/js/[name].js';
  // Return the altered config
  return config;
};

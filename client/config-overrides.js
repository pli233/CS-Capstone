const path = require('path');

module.exports = function override(config, env) {
  // Do stuff with the webpack config...
  config.entry = {
    main: path.join(__dirname, 'src', 'index.js'),
    contentScript: path.join(__dirname, 'src', 'content', 'contentScript.js'),
    background: path.join(__dirname, 'src', 'background', 'background.js'),
  };
  config.output.filename = 'static/js/[name].js';
  // Return the altered config
  return config;
};

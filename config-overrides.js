/* eslint-disable no-param-reassign */
const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);

  if (!config.plugins) {
    config.plugins = [];
  }

  config.module.rules.push(
    {
      test: /\.glsl$/i,
      use: 'raw-loader',
    },
  );

  config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
  return config;
};

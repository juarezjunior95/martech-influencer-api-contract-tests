const path = require('path');
const singleSpaDefaults = require('webpack-config-single-spa-react-ts');
const { merge } = require('webpack-merge');

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: 'martech',
    projectName: 'theloophub-mfe',
    webpackConfigEnv,
    argv,
  });
  const isProduction = argv.mode === 'production';
  const disableSourceMap =
    isProduction &&
    (webpackConfigEnv.disableSourceMap === true ||
      process.env.WEBPACK_DISABLE_SOURCEMAP === 'true');

  // any shared-dependencie should be added to this array
  const sharedDependencies = [
    'admin-portal-shared-services',
    'martech-portal-shared-services',
  ];

  const defaultRules = defaultConfig.module?.rules ?? [];
  const cachedDefaultRules = defaultRules.map((rule) => {
    if (String(rule.test) !== String(/\.(js|ts)x?$/)) {
      return rule;
    }

    return {
      ...rule,
      use: {
        ...rule.use,
        options: {
          ...rule.use?.options,
          cacheCompression: false,
          cacheDirectory: path.resolve(__dirname, '.babel-cache'),
        },
      },
    };
  });

  const config = {
    devtool: disableSourceMap ? false : defaultConfig.devtool,
    cache: {
      type: 'filesystem',
      name: isProduction ? 'production' : 'development',
      buildDependencies: {
        config: [__filename],
      },
      cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    },
    // when using the standalone mode we need any shared dependencie to not be an external, because there is no importmap in the standalone mode
    externals: webpackConfigEnv.standalone ? undefined : sharedDependencies,
    // customize your webpack config here, it will be merged with the single-spa-defaults
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: {
        'react/jsx-runtime': 'react/jsx-runtime.js',
      },
    },
    module: {
      rules: [
        {
          test: /\.pdf$/i,
          type: 'asset/resource',
        },
      ],
    },
  };

  return merge(
    {
      ...defaultConfig,
      module: {
        ...defaultConfig.module,
        rules: cachedDefaultRules,
      },
    },
    config,
  );
};

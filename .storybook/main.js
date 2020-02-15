const path = require("path");
const SRC_PATH = path.join(__dirname, '../src');
const STORIES_PATH = path.join(__dirname, '../src/stories');
const EXCLUDE_PATH = path.join(__dirname, '../node_modules');

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [SRC_PATH, STORIES_PATH],
      exclude: EXCLUDE_PATH,
      use: [
        {
          loader: require.resolve('awesome-typescript-loader'),
          options: {
            configFileName: './tsconfig.json'
          }
        },
        { loader: require.resolve('react-docgen-typescript-loader') }
      ]
    }, {
      test: /\.scss$/,
      loaders: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: {
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
            localsConvention: 'camelCaseOnly',
            importLoaders: 1,
          },
        },
        require.resolve('sass-loader')
      ],
    });
    config.resolve.extensions.push('.ts', '.tsx', '.scss', '.sass');
    return config;
  },
};

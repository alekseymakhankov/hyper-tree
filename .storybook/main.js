const path = require('path')

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5'
    },
    webpackFinal: async (config, { configType }) => {
        config.module.rules.push({
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]__[local]___[hash:base64:5]',
                            exportLocalsConvention: 'camelCaseOnly'
                        },
                        importLoaders: 1
                    }
                },
                {
                    loader: 'sass-loader'
                }
            ],
            include: path.resolve(__dirname, '../')
        })

        return config
    }
}

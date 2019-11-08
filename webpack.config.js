const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
 
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'js/main.js',
    },
    devServer: {
        contentBase: path.join(__dirname, 'docs'),
        compress: true,
        host: '0.0.0.0',
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
            	test: /\.(jpg|png|svg)$/,
            	loader: 'file-loader',
            	options: {
            		name: '[name].[ext]',
                    publicPath: 'images',
            		outputPath: 'css/images',
            	},
            	
            },

            // ...additional rules...
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/main.css",
        }),
    ],
};
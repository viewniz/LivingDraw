const VueLoaderPlugin = require('vue-loader/lib/plugin');
let path = require('path');

module.exports = {
    mode: 'development', //개발할때만
    devtool: 'eval', //개발시 웹팩 속도빠름
    resolve: {
        extensions: ['.js', '.vue'],
    },
    entry: {
        app: path.join(__dirname, 'main.js'),
    },
    module: {
        rules: [{ //vue문법 javascript로 변환
            test: /\.vue$/,
            loader: 'vue-loader',
        }],
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
    },
};
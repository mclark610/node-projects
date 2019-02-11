'use strict';

const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack')
// node : the listed modules are built in to node.  webpack gets confused if
//        they arent included in node
// externals: webpack throws lots of errors for modules used in node_modules
//            directory.  This is one way of telling webpack to not bother
module.exports = {
    mode: 'development',
    devServer: {
        contentBase: './dist',
        hot: true
    },
    entry: {
        app: './server.js',
    },
    externals: [ nodeExternals({
        whitelist: [
            'webpack/hot/dev-server',
            /^lodash/
        ]
    })],
    node: {
        fs: 'empty',
        tls: 'empty',
        net: 'empty'
    },
    output: {
        filename: 'server.bundle.js',
        path: path.resolve(__dirname,'dist'),
        publicPath: __dirname
    }
};

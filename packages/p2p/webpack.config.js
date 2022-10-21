const { resolve } = require("node:path");
const webpack = require("webpack");
const { createRequire } = require("node:module");
const { fileURLToPath } = require("node:url");

const config = {
  entry: "./src.ts/index.ts",
  mode: process.env.NODE_ENV || "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new webpack.ProvidePlugin({ process: "process/browser" })],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      process: "process/browser",
    },
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify"),
      fs: false,
      zlib: require.resolve("browserify-zlib"),
      url: require.resolve("url"),
      buffer: require.resolve("buffer")
    },
  },
  output: {
    globalObject: 'this',
    filename: "index.js",
    path: resolve(__dirname, "lib"),
    libraryTarget: "umd",
    library: "this",
  },
};

module.exports = config;

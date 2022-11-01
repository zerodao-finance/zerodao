const path = require("path");
const webpack = require("webpack");

const generalConfig = {
  entry: "./lib/index.js",
  mode: process.env.NODE_ENV || "production",
  target: "web", 
  plugins: [new webpack.ProvidePlugin({ process: "process/browser" })],
  resolve: {
    extensions: [".js", ".json"],
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
      buffer: require.resolve("buffer"),
    },
  },
  output: {
    filename: "browser.js",
    path: path.resolve(__dirname, "lib"),
  }
};

module.exports = (env, argsv) => {
  return generalConfig;
}

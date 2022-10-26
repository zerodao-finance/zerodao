const path = require("path");
const webpack = require("webpack");

const generalConfig = {
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
      buffer: require.resolve("buffer"),
    },
  }
};

const browserConfig = {
  // target: 'web',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib/browser"),
    libraryTarget: "umd",
    library: "this",
  }
}

// Build not fully functional
const nodeConfig = {
  // target: 'node',
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "lib/node"),
    libraryTarget: "umd",
    library: "this",
  },
}

module.exports = (env, argsv) => {
  Object.assign(browserConfig, generalConfig);
  // Since Node build is not fully functional
  // Object.assign(nodeConfig, generalConfig);

  // return [browserConfig, nodeConfig];
  return browserConfig;
}

import { resolve } from "node:path";
import webpack from "webpack";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = fileURLToPath(new URL(".", import.meta.url));
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
    filename: "index.js",
    path: resolve(__dirname, "lib"),
    libraryTarget: "umd",
    library: "this",
  },
};

export default config;

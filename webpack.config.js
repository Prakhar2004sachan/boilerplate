const path = require("path");
const PugPlugin = require("pug-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

const dirApp = path.join(__dirname, "app");
const dirImages = path.join(__dirname, "images");
const dirVideos = path.join(__dirname, "videos");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");
const dirNode = "node_modules";

module.exports = {
  mode: IS_DEVELOPMENT ? "development" : "production",
  entry: [path.join(dirApp, "index.js"), path.join(dirStyles, "index.scss")],
  output: {
    path: path.join(__dirname, "public"),
    publicPath: "/",
    // filename: "[name].js",
    clean: true,
  },
  resolve: {
    modules: [dirApp, dirShared, dirStyles, dirNode, dirImages, dirVideos],
    alias: {
      "@app": dirApp,
      "@shared": dirShared,
      "@styles": dirStyles,
      "@dirNode": dirNode,
      "@dirImages": dirImages,
      "@dirVideos": dirVideos,
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "./shared",
          to: "",
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "",
            },
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        loader: "file-loader",
      },
      {
        test: /\.(woff2?|fnt)$/,
        loader: "file-loader",
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: !IS_DEVELOPMENT,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              ["svgo", { plugins: [{ name: "preset-default" }] }],
            ],
          },
        },
      }),
    ],
  },
};

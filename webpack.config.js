const path = require("path");
const PugPlugin = require("pug-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

const dirApp = path.join(__dirname, "app");
const dirAssets = path.join(__dirname, "assets");
const dirShared = path.join(__dirname, "shared");
const dirStyles = path.join(__dirname, "styles");

module.exports = {
  mode: IS_DEVELOPMENT ? "development" : "production",
  entry: {
    index: "./app/views/index.pug",
  },
  output: {
    path: path.join(__dirname, "public"),
    publicPath: "/",
    filename: "assets/js/[name].[contenthash:8].js",
    clean: true,
  },
  resolve: {
    modules: [dirApp, dirAssets, dirShared, dirStyles, "node_modules"],
    alias: {
      "@app": dirApp,
      "@assets": dirAssets,
      "@shared": dirShared,
      "@styles": dirStyles,
    },
  },
  plugins: [
    new PugPlugin({
      pretty: IS_DEVELOPMENT,
      extractCss: {
        filename: "assets/css/[name].[contenthash:8].css",
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
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
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/img/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.(woff2?|fnt)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.mp4$/,
        type: "asset/resource",
        generator: {
          filename: "assets/videos/[name].[hash:8][ext]",
        },
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
              ["optipng", { optimizationLevel: 8 }],
              ["svgo", { plugins: [{ name: "preset-default" }] }],
            ],
          },
        },
      }),
    ],
  },
};

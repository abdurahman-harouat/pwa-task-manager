const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProd = process.env.NODE_ENV === "production";

const plugins = [
  new CopyPlugin({
    patterns: [
      { from: "public/manifest.json", to: "." },
      { from: "public/icons", to: "icons" },
    ],
  }),
  new HtmlWebpackPlugin({
    template: "./public/index.html",
    favicon: "./public/icons/icon-192x192.png",
  }),
];

// Only add Workbox in production
if (isProd) {
  const WorkboxPlugin = require("workbox-webpack-plugin");
  plugins.push(
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    })
  );
}

module.exports = {
  mode: isProd ? "production" : "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext][query]",
        },
      },
    ],
  },
  plugins,
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    hot: true,
  },
};

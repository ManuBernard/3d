const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = { entry: {}, plugins: [] };

const addProject = (name) => {
  console.log(`../src/${name}/index.html`);

  module.exports.entry[name] = path.resolve(
    __dirname,
    `../src/${name}/script.js`
  );

  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../src/${name}/index.html`),
      filename: `${name}/index.html`,
      minify: true,
    })
  );
};

const projects = ["clock", "solarsystem"];

projects.forEach((project) => {
  addProject(project);
});

module.exports.output = {
  filename: "[name]/bundle.[contenthash].js",
  path: path.resolve(__dirname, "../dist"),
};

module.exports.devtool = "source-map";
module.exports.plugins.push(
  new CopyWebpackPlugin({
    patterns: [{ from: path.resolve(__dirname, "../static") }],
  }),
  new MiniCSSExtractPlugin({ filename: "[name]/style.css" })
);

module.exports.module = {
  rules: [
    // HTML
    {
      test: /\.(html)$/,
      use: ["html-loader"],
    },

    // JS
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ["babel-loader"],
    },

    // CSS
    {
      test: /\.css$/,
      use: [MiniCSSExtractPlugin.loader, "css-loader"],
    },
    {
      test: /\.(jpg|png|gif|svg)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "assets/images/",
          },
        },
      ],
    },

    // Fonts
    {
      test: /\.(ttf|eot|woff|woff2)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            outputPath: "assets/fonts/",
          },
        },
      ],
    },
  ],
};

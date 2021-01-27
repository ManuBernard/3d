const dirTree = require("directory-tree");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

// Method to add a project to the webpack config
const addProject = (name) => {
  console.log(`../src/${name}/index.html`);

  module.exports.entry[name] = path.resolve(
    __dirname,
    `../src/${name}/script.js`
  );

  module.exports.plugins.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../src/${name}/index.html`),
      chunks: [name],
      filename: `${name}/index.html`,
      minify: true,
    })
  );
};

// Init webpack module
module.exports = { entry: {}, plugins: [] };

// For all projects in the src folder
const tree = dirTree("./src/");

// Add the project to the webpack config
tree.children.forEach((project) => {
  console.log(project.name);

  addProject(project.name);
});

module.exports.output = {
  filename: "[name]/bundle.[contenthash].js",
  path: path.resolve(__dirname, "../dist"),
};

module.exports.devtool = "source-map";

module.exports.plugins.push(
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
      use: [MiniCSSExtractPlugin.loader, "css-loader", "postcss-loader"],
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

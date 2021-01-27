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

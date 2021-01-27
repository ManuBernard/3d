const fse = require("fs-extra");
const fs = require("fs"); // Or `import fs from "fs";` with ESM

const arguments = process.argv.slice(2);
const name = arguments[0];

const { exec } = require("child_process");

const srcDir = `templates/playground`;
const destDir = `src/${name}`;

if (!fs.existsSync(destDir)) {
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log("success!");
    }
  });
}

process.env["toOpen"] = name;

exec("webpack serve --config ./bundler/webpack.dev.js");

exec("code src/" + name + "/script.js");

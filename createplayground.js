const fse = require("fs-extra");
const fs = require("fs");

const arguments = process.argv.slice(2);
const name = arguments[0];

const { exec } = require("child_process");

const srcDir = `templates/journey`;
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

exec("code src/" + name + "/script.js");

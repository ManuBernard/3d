const fse = require("fs-extra");

const arguments = process.argv.slice(2);
const name = arguments[0];

console.log(name);
const srcDir = `playground/template`;
const destDir = `playground/${name}`;

fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log("success!");
  }
});

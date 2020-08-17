var fs = require("fs");
const util = require('util');
const read = util.promisify(fs.readFile);

function update(name, hash, bundleName) {
  read('../web-manifest.json', 'utf8').then(data => {
    const manifest = JSON.parse(data);

    for (var i = 0; i < manifest.length; i++) {
      var m = manifest[i]

      if (m.name === name) {
        m.hash = hash
        m.bundleName = bundleName

        var updatedManifest = JSON.stringify(manifest)
        
        fs.writeFile("../web-manifest.json", updatedManifest, function (err) {
          if (err) return console.log(err)
        })

        break
      }
    }
  });
}

function appExsit(name) {
  const data = fs.readFileSync('../web-manifest.json', 'utf8');
  const manifest = JSON.parse(data);

  for (var i = 0; i < manifest.length; i++) {
    var m = manifest[i]

    if (m.name === name) {
      return true;
    }
  }

  return false;

}

module.exports = {update, appExsit};